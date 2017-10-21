import { Component, ViewChild } from '@angular/core';
import { NavController, ModalController, NavParams, Col, Slide } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { CONTACT_LIST } from '../mocks/contacts-details';
import { DatabaseProvider } from './../../providers/database/database';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  // @ViewChild('groupDivs') groupDiv: Slide;

  exmArr = []
  groups = [];
  grouplist = [];
  searchResults = [];
  groupInput: string;
  groupval; string
  colorGroup: string;
  searchInput: string;

  constructor(private databaseprovider: DatabaseProvider, private navParam: NavParams, public modalCtrl: ModalController, private storage: Storage, public navCtrl: NavController) {

    this.databaseprovider.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.loadDeveloperData();
      }
    })

  }

  loadDeveloperData() {
    this.databaseprovider.getAllGroup().then(data => {
      this.groups = data;
      console.log(this.groups)
    })
  }

  // changeCardColor(group) {
  //   var divs = document.getElementsByClassName( 'div-circle' );
  //   divs.style.backgroundColor = 'blue';
  // }

  navcontactList(group: any){
    this.databaseprovider.getAllGroupContacts(this.groupval).then(data => {
      this.grouplist = data;
      this.navCtrl.push('ContactListPage', { groupval: group.groupname, colorGroup: group.color });
      console.log("groupname", this.groupval);
    })
  }

  filterItems(ev: any){
    this.loadDeveloperData();
    let val = ev.target.value;
    if(val && val.trim() != ''){
      this.searchResults = this.searchResults.filter(function(item){
        return item.toLowerCase().includes(val.toLowerCase());
      });
    }
  }

  onClear(){
    this.searchResults = [];
  }
  onCancel(event) { }
  onInput(event) { }

  createGroup() {
    const openGroup = this.modalCtrl.create('CreateGroupPage');
    openGroup.present();
  }
  createContact() {
    const openGroup = this.modalCtrl.create('AddContactPage');
    openGroup.present();
  }

}

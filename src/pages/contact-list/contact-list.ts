import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController, NavParams } from 'ionic-angular';
import { DatabaseProvider } from './../../providers/database/database';

@IonicPage()
@Component({
  selector: 'page-contact-list',
  templateUrl: 'contact-list.html',
})
export class ContactListPage {

  groupDetails = [];
  first_letter: any;
  first_letter_val: any;

  contacts = [];
  groupval: any;
  groupvalCol: any;
  grouplist = [];

  constructor(private databaseprovider: DatabaseProvider, private modalCtrl:ModalController,  public navCtrl: NavController, public navParams: NavParams) {
    // this.databaseprovider.getAllGroupContacts(this.groupval).then(data => {
    //   this.grouplist = data;
    // })

    this.databaseprovider.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.groupval = this.navParams.get('groupval');
        this.groupvalCol = this.navParams.get('colorGroup');
        console.log("groupname", this.groupval);
        this.loadDeveloperData();
      }
    })

  }

  loadDeveloperData() {
    this.databaseprovider.getAllGroupContacts(this.groupval).then(data => {
      this.contacts = data;
      console.log(this.contacts)
    })
  }

  createContact() {
    const openGroup = this.modalCtrl.create('AddContactPage');
    openGroup.present();
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactListPage');
  }

}

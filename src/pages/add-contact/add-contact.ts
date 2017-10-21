import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatabaseProvider } from './../../providers/database/database';
import { HomePage } from '../../pages/home/home'

@IonicPage()
@Component({
  selector: 'page-add-contact',
  templateUrl: 'add-contact.html',
})
export class AddContactPage {

  form: FormGroup;
  contacts = [];
  contact = {};
  allGroups = [];

  constructor(private databaseprovider: DatabaseProvider, private view: ViewController, private formBuilder: FormBuilder, public navCtrl: NavController, public navParams: NavParams) {

  //   this.form = formBuilder.group({
  //     groups: ['', Validators.compose([Validators.maxLength(20), Validators.pattern('[a-zA-Z]*'), Validators.required])],
  // });

    this.databaseprovider.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.loadDeveloperData();
      }
    })

    this.getGroups();

  }

  loadDeveloperData() {
    this.databaseprovider.getAllContacts().then(data => {
      this.contacts = data;
    })
  }

  getGroups(){
    this.databaseprovider.getAllGroup().then((data) => {
      this.allGroups = data;
      console.log('all groups ', this.allGroups);
    })
  }
  groupList(){

  }

  addContact() {
    this.databaseprovider.addContacts(this.contact['fname'], this.contact['groupname'], parseInt(this.contact['phone']))
    .then(data => {
      this.loadDeveloperData();
    });
    this.contact = {};
    this.navCtrl.setRoot(HomePage);
  }

  closeModal(){
    this.view.dismiss();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddContactPage');
  }

}

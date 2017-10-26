import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController, NavParams, ToastController } from 'ionic-angular';
import { Contacts, Contact, ContactField, ContactName, ContactFieldType } from '@ionic-native/contacts';
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
  pickedContact: any;
  givenName: any;
  familyName: any;
  phoneNo: any;

  constructor(private _contacts: Contacts, private _contact: Contact, private toastCtrl: ToastController, private databaseprovider: DatabaseProvider, private modalCtrl: ModalController, public navCtrl: NavController, public navParams: NavParams) {

    this.databaseprovider.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.groupval = this.navParams.get('groupval');
        this.groupvalCol = this.navParams.get('colorGroup');
        console.log("groupname", this.groupval);
        this.loadDeveloperData();
      }
    })
  }

  respToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }

  //pick contacts
  pickUserContact(contact) {
    this._contacts.pickContact().then((data) => {
      this.pickedContact = data;
      this.givenName = this.pickedContact.name.givenName;
      this.familyName = this.pickedContact.name.familyName;
      this.phoneNo = this.pickedContact.phoneNumbers[0].value.toString();
      this.respToast('contact selected! ' + this.givenName);
      this.respToast('contact selected! ' + this.familyName);
      this.respToast('contact selected! ' + this.phoneNo);
      this.addPickedContact();
    }).catch((Error) => {
      this.respToast(Error)
    })
  }

  //add picked contact to the database
  addPickedContact(){
    this.databaseprovider.addContacts(this.givenName, this.familyName, this.groupval, this.phoneNo).then((data) => {
      this.respToast(`${this.givenName} added to ${this.groupval} group`);
    }).catch((Error) =>{
      this.respToast(`Couldnt add ${this.givenName} to ${this.groupval} group` + Error);
    });

  }

  loadDeveloperData() {
    this.databaseprovider.getAllGroupContacts(this.groupval).then(data => {
      this.contacts = data;
      //this.respToast(this.contacts);
    }).catch((Error) => {
      this.respToast(Error);
    })
  }

  createContact() {
    const openGroup = this.modalCtrl.create('AddContactPage');
    openGroup.present();
  }

}

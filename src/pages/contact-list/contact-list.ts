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
      this.respToast('contact selected! ' + typeof (this.pickedContact.displayName));
      this.respToast('contact selected! ' + typeof (this.pickedContact.phoneNumbers[0].value.toString()));
    }).catch((Error) => {
      this.respToast(Error)
    })
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

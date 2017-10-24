import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, LoadingController } from 'ionic-angular';
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
  submitAttemp: boolean = false;

  constructor(private loadCtrl: LoadingController, private toast: ToastController, private databaseprovider: DatabaseProvider, private view: ViewController, private formBuilder: FormBuilder, public navCtrl: NavController, public navParams: NavParams) {

    this.databaseprovider.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.loadDeveloperData();
      }
    })
    this.getGroups();
  }

  //create contacts
  // addContact(){
  //   let contact: Contact = this.contacts.create();
  // }

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
  groupList(newForm){
    let selectedForm = this.contacts.find((f)=>{
      return f.id == newForm;
    });
    this.contacts['groupname'] = selectedForm;
  }

  addContact() {
    this.submitAttemp = true
    if(this.contact['fname'] && this.contact['groupname'] && parseInt(this.contact['phone'])){
      this.databaseprovider.addContacts(this.contact['fname'], this.contact['groupname'], parseInt(this.contact['phone']))
      .then(data => {
        this.loadDeveloperData();
      });
      this.contact = {};
      this.loading('creating contacts')
      this.navCtrl.setRoot(HomePage);
      this.suceessToast('Contact was successfully created');
      }else if(this.contact['fname'] == '' || parseInt(this.contact['phone'].lenght) <= 0){
        this.validationToast('Contact name and phone number cannot be empty');
      }else if(this.contact['groupname'].lenght < 1){
        this.validationToast('Please select a group for your contact');
      }else{
        this.validationToast('Contact name and phone field cannot be empty');
      }
  }

  suceessToast(msg: string){
    let toast = this.toast.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    })
  }

  validationToast(msg: string) {
    let toast = this.toast.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }

  loading(msg: string){
    const loading = this.loadCtrl.create({
      spinner: 'bubbles',
      content: msg
    })
    loading.present();
      setTimeout(() => {
        loading.dismiss();
      }, 3000);
  }

  closeModal(){
    this.view.dismiss();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddContactPage');
  }

}

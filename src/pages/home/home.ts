import { Component } from '@angular/core';
import { NavController, ModalController, ActionSheetController, Platform, ToastController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DatabaseProvider } from './../../providers/database/database';
import { Contacts, Contact, ContactField, ContactName, ContactFieldType } from '@ionic-native/contacts';
import { DomSanitizer } from '@angular/platform-browser';
import { SMS } from '@ionic-native/sms';
import { CallNumber } from '@ionic-native/call-number';
import { SocialSharing } from '@ionic-native/social-sharing';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  contactNo: any;
  phoneList = 'contacts'

  groups = [];
  grouplist = [];
  searchResults = [];
  groupInput: string;
  groupval; string
  colorGroup: string;
  searchInput: string;
  isGroupEmpty: boolean = true;
  whereTosearch: ContactFieldType[] = ['displayName'];
  q: string;
  callNo: string;
  message: any;
  foundContacts = [];
  usersGroup = []
  firstLetter: string;
  pickedContact: any;

  constructor(private socialSharing: SocialSharing, public alertCtrl: AlertController, private toastCtrl:ToastController, private sms: SMS, private callcont: CallNumber, private platform: Platform, private actionsheet: ActionSheetController, private sanitize: DomSanitizer, private contacts: Contacts, private contact: Contact, private databaseprovider: DatabaseProvider, public modalCtrl: ModalController, public navCtrl: NavController) {

    this.search(' ');
    this.databaseprovider.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.loadDeveloperData();
      }
    })
  }

  //prompt message
  showPrompt(phNo) {
    let prompt = this.alertCtrl.create({
      title: 'SMS',
      message: "Enter your message to send",
      cssClass: 'alertcss',
      inputs: [
        {
          name: 'MESSAGE',
          type: 'string',
          placeholder: 'send sms'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Send',
          handler: data => {
            this.message = data.MESSAGE;
            if(this.message !== ''){
              this.sendSMS(phNo, this.message);
            }else{
              this.respToast(typeof(phNo) + phNo + typeof(this.message) + this.message )
            }
            console.log('Saved clicked');
          },
        }
      ]
    });
    prompt.present();
  }

  respToast(msg){
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 5000
    });
    toast.present();
  }

  //delete contacts
  deleteContact(contact){
    this.contact.remove().then((data) =>{
      contact = [this.contact.phoneNumbers[0]]
      this.respToast('contact was successfully removed');
    }).catch((Error) =>{
      this.respToast(Error)
    });
  }

  //open more option
  openMenu(phNo: string, index) {
    let actionsheet = this.actionsheet.create({
      title: 'Options',
      cssClass: 'page-home',
      buttons: [
        {
          text: 'Call',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'call' : null,
          handler: () => {
            this.call(phNo);
            console.log('Call clicked');
          }
        },
        {
          text: 'Send SMS',
          icon: !this.platform.is('ios') ? 'mail' : null,
          handler: () => {
            //this.sendSMS(phNo, sms);
            this.showPrompt(phNo);
            console.log('Send sms clicked');
          }
        },
        {
          text: 'Share',
          icon: !this.platform.is('ios') ? 'share' : null,
          handler: () => {
            var msg = this.compilemsg(index)
            this.socialSharing.share(msg, null, null, null)
            this.respToast('sharing' + msg)
            //this.regularShare(phNo);
            console.log('Share clicked');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel', // will always sort to be on the bottom
          icon: !this.platform.is('ios') ? 'close' : null,
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionsheet.present()
  }

  compilemsg(index):string{
    var msg = this.foundContacts[index].displayName + "\n Number: " + this.foundContacts[index].phoneNumbers[0].value ;
    return msg.concat("\n Sent from my Call Tree App !");
  }

  regularShare(index){
    var msg = this.compilemsg(index)
    this.socialSharing.share(msg, null, null, null)
  }

  call(callNo: string){
    this.callcont.callNumber(callNo, true).then(() => {
      this.respToast('Now calling');
    }).catch((err)=>{
      this.respToast('unable to call');
    })
  }

  //send sms
  sendSMS(callNo: string, sms: string){
    var option: {
      replaceLineBreaks: true,
      android: {
        intent: 'INTENT'
      }
    }
    this.sms.send(callNo, sms, option).then(() => {
      this.respToast('message sent');
    }).catch((err)=>{
      JSON.stringify(this.respToast(console.error));
    })
  }

  //search all phone contacts
  search(val) {
    this.contacts.find(this.whereTosearch, { filter: val, multiple: true }).then((data) => {
      this.foundContacts = data;
      // for(var i=0; i<this.foundContacts.length; i++){
      //   this.firstLetter = this.foundContacts[i].displayName.charAt(0);
      // }
      this.firstLetter = this.foundContacts[0].displayName.charAt(0);
    }).catch((err) => {
      alert(JSON.stringify(err));
    })
  }

  //sanitize all contact img
  sanitizeImg(val) {
    return this.sanitize.bypassSecurityTrustUrl(val)
  }

  //search contact list
  onsearch(ev) {
    this.search(ev.target.value)
  }

  loadDeveloperData() {
    this.databaseprovider.getAllGroup().then(data => {
      this.groups = data;
      if (this.groups.length < 1) {
        this.isGroupEmpty = true;
      } else {
        this.isGroupEmpty = false;
      }
      //this.respToast('hompage'+this.groups)
    }).catch((Error) => {
      this.respToast('get all group err' + Error)
    })
  }

  navcontactList(group: any) {
    this.databaseprovider.getAllGroupContacts(this.groupval).then(data => {
      this.grouplist = data;
      this.navCtrl.push('ContactListPage', { groupval: group.groupname, colorGroup: group.color });
      console.log("groupname", this.groupval);
    })
  }

  doRefresh(refresher) {
    this.loadDeveloperData();
    setTimeout(() => {
      console.log('update has ended');
      refresher.complete();
    }, 2000);
  }

  onClear() {
    this.search(' ');
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

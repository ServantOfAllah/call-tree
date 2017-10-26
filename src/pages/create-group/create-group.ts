import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { HomePage } from '../../pages/home/home';
import { DatabaseProvider } from './../../providers/database/database';

@IonicPage()
@Component({
  selector: 'page-create-group',
  templateUrl: 'create-group.html',
})
export class CreateGroupPage {

  form: FormGroup;
  submitAttemp: boolean = false;

  groups = [];
  group = {};
  groupsColor = [];
  isGroupEmpty: boolean = false;

  constructor(private loadCtrl: LoadingController, private toast: ToastController, private databaseprovider: DatabaseProvider, private storage: Storage, private view: ViewController, private formBuilder: FormBuilder, public navCtrl: NavController, public navParams: NavParams) {
    this.databaseprovider.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.loadDeveloperData();
      }
    })

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

  loadDeveloperData() {
    this.databaseprovider.getAllGroup().then(data => {
      this.groups = data;
    }).catch((Error) =>{
      this.respToast('couldnt read all from group '+Error)
    })
  }

  groupColor(){

  }

  getGroups(){
    this.databaseprovider.getAllGroup().then((data) => {
      this.groupsColor = data;
      this.respToast('all groups ' + this.groupsColor);
    }).catch((Error) =>{
      this.respToast('couldnt get all groups ' + Error)
    })
  }

  addGroup() {
    this.submitAttemp = true
    if(this.group['groupname'] && this.group['color']){
      this.databaseprovider.addGroups(this.group['groupname'], this.group['color']).then(data => {
        this.loadDeveloperData();
      }).catch((Error) => {
        this.respToast('couldnt get group ' + Error)
      });
      this.group = {};
      this.loading('loading');
      this.navCtrl.setRoot(HomePage);
      this.respToast('Contact group was successfully created');
      console.log("group created", this.group)
    }else if(this.group['groupname'].lenght > 7){
      this.respToast('Too long, lenght cannot be more than 10 letters');
      this.submitAttemp = false;
    }else if(this.group['groupname'] == ''){
      this.respToast('Too short, lenght cannot be less than 3 letters');
      this.submitAttemp = false;
    }else{
      this.respToast('The group name and color field cannot be empty');
    }
  }

  respToast(msg){
    let toast = this.toast.create({
      message: msg,
      duration: 5000
    });
    toast.present();
  }

  doRefresh(refresher){
    this.getGroups();
    setTimeout(() => {
      console.log('update has ended');
      refresher.complete();
    }, 2000);
  }

  closeModal() {
    this.view.dismiss();
  }

}

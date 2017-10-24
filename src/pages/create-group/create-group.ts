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
  isGroupEmpty: boolean;

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
    })
  }

  groupColor(){

  }

  getGroups(){
    this.databaseprovider.getAllGroup().then((data) => {
      this.groupsColor = data;
      console.log('all groups ', this.groupsColor);
    })
  }

  addGroup() {
    this.submitAttemp = true
    if(this.group['groupname'] && this.group['color']){
      this.databaseprovider.addGroups(this.group['groupname'], this.group['color']).then(data => {
        this.loadDeveloperData();
      });
      this.group = {};
      this.loading('loading');
      this.navCtrl.setRoot(HomePage);
      this.suceessToast('Contact group was successfully created');
      console.log("group created", this.group)
    }else if(this.group['groupname'].lenght > 7){
      this.validationToast('Too long, lenght cannot be more than 10 letters');
      this.submitAttemp = false;
    }else if(this.group['groupname'] == ''){
      this.validationToast('Too short, lenght cannot be less than 3 letters');
      this.submitAttemp = false;
    }else{
      this.validationToast('The group name and color field cannot be empty');
    }
  }

  doRefresh(refresher){
    this.getGroups();
    setTimeout(() => {
      console.log('update has ended');
      refresher.complete();
    }, 2000);
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

  closeModal() {
    this.view.dismiss();
  }

}

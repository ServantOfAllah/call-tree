import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
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

  groups = [];
  group = {};
  groupsColor = [];

  constructor(private databaseprovider: DatabaseProvider, private storage: Storage, private view: ViewController, private formBuilder: FormBuilder, public navCtrl: NavController, public navParams: NavParams) {
    // this.form = formBuilder.group({
    //   groups: ['', Validators.compose([Validators.maxLength(20), Validators.pattern('[a-zA-Z]*'), Validators.required])],
    //});

    this.databaseprovider.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.loadDeveloperData();
      }
    })

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
    this.databaseprovider.addGroups(this.group['groupname'], this.group['color']).then(data => {
      this.loadDeveloperData();
    });
    this.group = {};
    this.navCtrl.setRoot(HomePage);
    console.log("group created", this.group)
  }
  closeModal() {
    this.view.dismiss();
  }

}

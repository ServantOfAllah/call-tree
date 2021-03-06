import { Injectable } from '@angular/core';
import { Platform, ToastController } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs/Rx';
import { Storage } from '@ionic/storage';

@Injectable()
export class DatabaseProvider {

  database: SQLiteObject;
  private databaseReady: BehaviorSubject<boolean>;

  constructor(private toastCtrl: ToastController, public sqlitePorter: SQLitePorter, private storage: Storage, private sqlite: SQLite, private platform: Platform, private http: Http) {

    this.databaseReady = new BehaviorSubject(false);
    this.platform.ready().then(() => {
      //contacts table
      this.sqlite.create({
        name: 'contacts.db',
        location: 'default'
      })
      .then((db: SQLiteObject) => {
        this.database = db;
        this.storage.get('database_filled').then(val => {
          if(val){
            this.databaseReady.next(true);
          }else{
            this.fillDatabase();
          } //end of if statement
        }) //end of storage
      })
      //groups table
      this.sqlite.create({
        name: 'groups.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        this.database = db;
        this.database.executeSql("CREATE TABLE IF NOT EXISTS groups(id INTEGER PRIMARY KEY AUTOINCREMENT, groupname TEXT, color TEXT )", []).then((data) => {
          console.log("TABLE CREATED: ", data);
        }, (err)=>{
          this.respToast("Unable to execute sql " +err);
        })
      }, (err) => {
        this.respToast("Unable to open database" + err);
      })
    }); //end of platform.ready

  }

  respToast(msg){
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 5000
    });
    toast.present();
  }

  getAllGroup(){
    return this.database.executeSql("SELECT * FROM groups", []).then((data) => {
      let group = [];
      if(data.rows.length > 0){
        for(var i=0; i<data.rows.length; i++){
          group.push({groupname: data.rows.item(i).groupname, color: data.rows.item(i).color});
        }
      }
      return group;
    }, err => {
      this.respToast('couldnt get all groups db' + err)
      return [];
    })
  }

  addGroups(groupname, color){
    let data = [groupname, color];
    return this.database.executeSql("INSERT INTO groups (groupname, color) VALUES (?,?)", data).then(data => {
      return data;
    }, err => {
      this.respToast('couldnt add groups db' + err)
      return err;
    })
  }

  fillDatabase(){
    this.http.get('assets/dummyDump.sql')
    .map(res => res.text())
    .subscribe(sql => {
      this.sqlitePorter.importSqlToDb(this.database, sql)
      .then(data => {
        this.databaseReady.next(true);
        this.storage.set('database_filled', true);
      })
      .catch(e =>this.respToast('couldnt fill database db'+ e));
    });
  }

  addContacts(fname, lname, groupname, phone){
    let data = [fname, lname, groupname, phone];
    return this.database.executeSql("INSERT INTO contacts (fname, lname, groupname, phone) VALUES (?,?,?,?)", data).then(data => {
      return data;
    },err => {
      this.respToast('couldnt add contact db'+err)
      return err;
    });
  }

  getAllContacts(){
    return this.database.executeSql("SELECT * FROM contacts", []).then((data) => {
      let contact = [];
      if(data.rows.length >= 0){
        for(var i=0; i<data.rows.length; i++){
          contact.push({ fname: data.rows.item(i).fname, lname: data.rows.item(i).lname, groupname: data.rows.item(i).groupname, phone: data.rows.item(i).phone })
        } // end of for loop
      } //end of if statement
      return contact;
    }, err=> {
      this.respToast(err)
      return [];
    });
  }

  getAllGroupContacts(groupName: string){
    return this.database.executeSql('SELECT * FROM contacts WHERE groupname =  "'+ groupName +'" ', []).then((data) => {
      let contact = [];
      if(data.rows.length >= 0){
        for(var i=0; i<data.rows.length; i++){
          contact.push({ fname: data.rows.item(i).fname, lname: data.rows.item(i).lname, groupname: data.rows.item(i).groupname, phone: data.rows.item(i).phone })
        } // end of for loop
      } //end of if statement
      return contact;
    }, err=> {
      this.respToast('couldnt get groupcontact db' + err)
      return [];
    });
  }

  getDatabaseState() {
    return this.databaseReady.asObservable();
  }

}

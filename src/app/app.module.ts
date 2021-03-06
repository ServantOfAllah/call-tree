import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import { HttpModule } from '@angular/http';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { AboutPage } from '../pages/about/about';
import { HelpPage } from '../pages/help/help';
import { CreditPage } from '../pages/credit/credit';
import { ReportBugPage } from '../pages/report-bug/report-bug';
import { RatePage } from '../pages/rate/rate';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DatabaseProvider } from '../providers/database/database';
import { SMS } from '@ionic-native/sms';
import { CallNumber  } from '@ionic-native/call-number'
import { SocialSharing } from '@ionic-native/social-sharing';
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    AboutPage,
    HelpPage,
    CreditPage,
    ReportBugPage,
    RatePage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    AboutPage,
    HelpPage,
    CreditPage,
    ReportBugPage,
    RatePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    DatabaseProvider,
    SQLitePorter,
    SQLite,
    Contacts,
    Contact,
    SMS,
    CallNumber,
    SocialSharing,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DatabaseProvider
  ]
})
export class AppModule {}

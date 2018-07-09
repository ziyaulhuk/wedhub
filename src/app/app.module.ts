import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';
import { MyApp } from './app.component';
import { LoginPageModule } from './../pages/login/login.module';
import { HomePageModule } from './../pages/home/home.module';
import { LoginProvider } from '../providers/login/login';
import { CommonProvider } from '../providers/common/common';
import { HttpClientModule } from '@angular/common/http';
import { Calendar } from '@ionic-native/calendar';
import { ReactiveFormsModule } from '@angular/forms';
import { CallNumber } from '@ionic-native/call-number';
import { SocialSharing } from '@ionic-native/social-sharing';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { AngularFireModule } from "angularfire2";
import { AngularFireDatabaseModule } from 'angularfire2/database';
// import { AndroidPermissions } from '@ionic-native/android-permissions'
export const firebaseConfig = {
  apiKey: "AIzaSyDg1VyaPO41Pm4ivsK0TemrACoDd2vYzv0",
  authDomain: "ziyaul-wedlock.firebaseapp.com",
  databaseURL: "https://ziyaul-wedlock.firebaseio.com",
  projectId: "ziyaul-wedlock",
  storageBucket: "ziyaul-wedlock.appspot.com",
  messagingSenderId: "597828891252"
};

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    LoginPageModule,
    HomePageModule,
    ReactiveFormsModule,
    IonicModule.forRoot(MyApp, {
      scrollPadding: false,
      scrollAssist: true,
      autoFocusAssist: false
    }),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Calendar,
    CallNumber,
    SocialSharing,
    LaunchNavigator,
    // AndroidPermissions,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    LoginProvider,
    CommonProvider
  ]
})
export class AppModule { }

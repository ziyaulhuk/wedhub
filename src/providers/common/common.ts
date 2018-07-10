import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController, AlertController, ToastController } from 'ionic-angular';
// import { AngularFire, FirebaseObjectObservable, AngularFireAuth, FirebaseListObservable } from 'angularfire2';
import { AngularFireDatabase } from 'angularfire2/database';
// import { FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
/*
  Generated class for the CommonProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

export interface Note {
  name: string;
  email: string;
  mobile: string;
  attend: string;
  accomodation: string;
  count: string;
  created: string;
}

@Injectable()
export class CommonProvider {

  constructor(public http: HttpClient,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    public db: AngularFireDatabase
  ) {
    console.log('Hello CommonProvider Provider');
  }
  private wedListRef = this.db.list<Note>('wed-list');
  private loginListRef = this.db.list<Note>('login-list');

  presentAlert(title, msg) {
    let alert = this.alertCtrl.create({
      title: title,
      message: msg,
      buttons: ['Dismiss'],
      enableBackdropDismiss: false
    });
    alert.present();
  }

  addLoginData(data) {
    this.db.database.goOnline();
    this.loginListRef.push(data);
    this.db.database.goOffline();
  }

  addData(data) {
    this.db.database.goOnline();
    this.wedListRef.push(data);
  }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 5000,
      position: 'bottom',
      cssClass: 'center-text'
    });

    toast.present();
  }

  private loading: any;
  presentLoad = true;
  presentLoading(msg) {
    if (this.presentLoad) {
      this.presentLoad = false;
      this.loading = this.loadingCtrl.create({
        content: msg
      });
      this.loading.present();
    }
  }

  dismissLoading() {
    this.presentLoad = true;
    this.loading.dismiss();
  }

}

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
  created: string;
}

@Injectable()
export class CommonProvider {

  constructor(public http: HttpClient,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private db: AngularFireDatabase
  ) {
    console.log('Hello CommonProvider Provider');
  }
  private wedListRef = this.db.list<Note>('wed-list');
  presentAlert(title, msg) {
    let alert = this.alertCtrl.create({
      title: title,
      message: msg,
      buttons: ['Dismiss'],
      enableBackdropDismiss: false
    });
    alert.present();
  }
  addData(data) {
    this.wedListRef.push(data);
  }
  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
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

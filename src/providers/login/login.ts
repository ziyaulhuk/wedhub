import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

/*
  Generated class for the LoginProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoginProvider {

  constructor(public http: HttpClient, private storage: Storage) {
  }

  loginData = null;
  RSVP: boolean = null;
  saveLogin(data) {
    this.loginData = JSON.stringify(data);
    this.storage.set("user", data);
  }

  saveRSVPStatus(data) {
    this.RSVP = data;
    this.storage.set("RSVP", data);
  }

  getRSVPStatus() {
    if (this.RSVP !== null) {
      let self = this;
      return new Promise(function (resolve, reject) {
        resolve(self.RSVP);
      });
    }
    else {
      return this.storage.get("RSVP");
    }
  }

  clearLogin() {
    this.loginData = null;
    this.storage.clear();
  }

  getLoginData() {
    if (this.loginData !== null) {
      let self = this;
      return new Promise(function (resolve, reject) {
        resolve(JSON.parse(self.loginData));
      });
    }
    else {
      return this.storage.get("user");
    }
  }

}

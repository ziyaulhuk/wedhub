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
  saveLogin(data) {
    this.loginData = JSON.stringify(data);
    this.storage.set("user", data);
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

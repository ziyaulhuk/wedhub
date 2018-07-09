import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { LoginProvider } from '../../providers/login/login';
import { CommonProvider } from '../../providers/common/common';
import { FormGroup, FormControl, FormBuilder, Validators, NgForm } from '@angular/forms';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  loginForm: FormGroup;
  Name: string = "";
  Email: string = "";
  Mobile: Number = 0;

  constructor(
    public platform: Platform,
    private frmbuilder: FormBuilder,
    public navCtrl: NavController, private commonProvider: CommonProvider, public navParams: NavParams, private loginProvider: LoginProvider) {
    this.loginForm = this.frmbuilder.group({
      name: ['', Validators.compose([Validators.required, Validators.maxLength(20), Validators.minLength(5)])],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
    })
  }

  ionViewDidLoad() {
  }

  loginBtnclicked() {
    this.doLogin();
  }

  setFocusFn(x) {
    x.setFocus();
  }

  doLogin() {
    this.commonProvider.presentLoading("Please wait...");
    var user = {
      "name": this.Name,
      "mobile": this.Mobile,
      "email": this.Email
    };
    this.loginProvider.saveLogin(user);
    this.commonProvider.dismissLoading();
    this.navCtrl.setRoot("HomePage");
  }
}

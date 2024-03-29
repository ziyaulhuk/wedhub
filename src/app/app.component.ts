import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { LoginProvider } from '../providers/login/login';
import { HomePage } from '../pages/home/home';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, loginProvider: LoginProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // Keyboard.disableScroll(true);
      statusBar.styleDefault();
      splashScreen.hide();
      // loginProvider.clearLogin();
      loginProvider.getLoginData().then(val => {
        console.log(val);
        if (val === null || val === undefined) {
          this.rootPage = LoginPage;
        } else {
          this.rootPage = HomePage;
        }
      })
    });
  }
}


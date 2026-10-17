import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LaunchNavigator } from '@ionic-native/launch-navigator';

/**
 * Generated class for the MorePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-more',
  templateUrl: 'more.html',
})
export class MorePage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private launchNavigator: LaunchNavigator) {
  }

  ionViewDidLoad() {
  }
  launchMap() {
    this.launchNavigator.navigate("Tholudur Toll Plaza, Chennai- Trichy Highway");
  }
}

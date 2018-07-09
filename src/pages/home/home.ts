import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginProvider } from './../../providers/login/login';
import Fireworks from 'fireworks-canvas';
import { Calendar } from '@ionic-native/calendar';
// import { AndroidPermissions } from '@ionic-native/android-permissions';
import { CommonProvider } from './../../providers/common/common';
import { CallNumber } from '@ionic-native/call-number';
import { SocialSharing } from '@ionic-native/social-sharing';
import { LaunchNavigator } from '@ionic-native/launch-navigator';

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  @ViewChild('canvas') child: ElementRef;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    // private androidPermissions: AndroidPermissions,
    private loginProvider: LoginProvider,
    private commonProvider: CommonProvider,
    private calendar: Calendar,
    private callNumber: CallNumber,
    private socialSharing: SocialSharing,
    private launchNavigator: LaunchNavigator) {
  }
  data: any;
  ionViewDidLoad() {
    this.loginProvider.getLoginData().then(val => {
      if (val === null || val === undefined) {
        this.commonProvider.dismissLoading();
        this.navCtrl.setRoot("LoginPage");
      } else {
        // this.data = val.username;
        // this.getBeerData();
        this.data = val;
        console.log(this.data);
        this.StartFireWorks();
        this.AddEventToCalendar();
      }
    });
  }

  StartFireWorks() {
    const container = this.child.nativeElement;
    const options = {
      maxRockets: 5,            // max # of rockets to spawn
      rocketSpawnInterval: 250, // millisends to check if new rockets should spawn
      numParticles: 200,        // number of particles to spawn when rocket explodes (+0-10)
      explosionMinHeight: 0.4,  // percentage. min height at which rockets can explode
      explosionMaxHeight: 1.2,  // percentage. max height before a particle is exploded
      explosionChance: 0.03     // chance in each tick the rocket will explode
    }
    const fireworks = new Fireworks(container, options);
    fireworks.start();
  }

  AddEventToCalendar() {
    let startDate = new Date("Sun Aug 19 2018 11:00:00 GMT+0530 (India Standard Time)");
    let endDate = new Date("Sun Aug 19 2018 12:00:00 GMT+0530 (India Standard Time)");
    let opts = this.calendar.getCalendarOptions();
    opts.firstReminderMinutes = 24 * 60;
    opts.secondReminderMinutes = 2 * 60;
    this.calendar.findEventWithOptions("Ziyaul Weds Thaieba", "Jamia Masjid, V Kalathur, Perambalur", "Request Your Presence and Prayers", startDate, endDate, opts).then(
      (msg) => {
        if (msg.length === 0) {
          this.calendar.createEventWithOptions("Ziyaul Weds Thaieba", "Jamia Masjid, V Kalathur, Perambalur", "Request Your Presence and Prayers", startDate, endDate, opts).then(
            (msg) => { this.commonProvider.presentToast("Our Wedding Event is Added to Your Calendar") },
            (err) => { console.log(err); }
          );
        }
      },
      (err) => {
        this.calendar.hasReadWritePermission().then(
          (msg) => {
            if (!msg) {
              this.commonProvider.presentAlert("Alert", "Need Permission to Access Calendar to Add Our Wedding Event");
            }
          },
          (err) => { console.log(err); }
        )
      }
    )
  }

  CallMobile() {
    if (this.callNumber.isCallSupported()) {
      this.callNumber.callNumber("9688333128", true)
        .then(res => console.log('Launched dialer!', res))
        .catch(err => {
          console.log('Error launching dialer', err)
          this.commonProvider.presentAlert("Alert", "Need Permission to Call Mobile No Directly from this App.");
        });
    }
    else {
      this.commonProvider.presentAlert("Alert", "This device doesn't support Call Feature. Kindly Call to 9688333128 from other device.")
    }
  }

  ShareInvite() {
    let message = "Ziyaul Weds Thaieba\nYou are invited. Consider this as My Personal Invite.\nRequest Your Presence on Our Wedding Day.\nDownload Invite App From Google Play Store Now.";
    let subject = "Download Invite App";
    let file = null;
    let url = "https://play.google.com/store/apps/details?id=com.ziyaul.wedhub&hl=en";
    this.socialSharing.share(message, subject, file, url).then(() => {
      // Success!
    }).catch(() => {
      // Error!
    });
  }

  LauchNavigate() {
    this.launchNavigator.navigate("Jamia Masjid, V Kalathur, Perambalur");
  }

  SendRSVP() {
    // setTimeout(()=>alert.present(),3000);
    // this.data.email = "ziyaulhuk@gmail.com";
    // this.data.name = "ziyaulhuk";
    // this.data.mobile = "9688333128";
    this.data.created = new Date().toISOString();
    console.log(this.data);
    this.commonProvider.addData(this.data);
  }
}

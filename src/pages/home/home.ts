import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { LoginProvider } from './../../providers/login/login';
import Fireworks from 'fireworks-canvas';
import { Calendar } from '@ionic-native/calendar';
// import { AndroidPermissions } from '@ionic-native/android-permissions';
import { CommonProvider } from './../../providers/common/common';
import { CallNumber } from '@ionic-native/call-number';
import { SocialSharing } from '@ionic-native/social-sharing';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
// import { InAppBrowser } from '@ionic-native/in-app-browser';

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
    public alertCtrl: AlertController,
    private socialSharing: SocialSharing,
    // private iab: InAppBrowser,
    private launchNavigator: LaunchNavigator) {
  }

  data: any;
  modalOn: boolean = false;
  ionViewDidLoad() {
    this.loginProvider.getLoginData().then(val => {
      if (val === null || val === undefined) {
        this.commonProvider.dismissLoading();
        this.navCtrl.setRoot("LoginPage");
      } else {
        this.data = val;
        console.log(this.data);
        this.StartFireWorks();
        this.AddEventToCalendar();
        setTimeout(() =>
          this.loginProvider.getRSVPStatus().then(
            result => {
              if ((result === null || result === false) && this.modalOn === false) {
                this.showAlert('Send RSVP?', 'Would you like to send RSVP now?')
              }
            }),
          25000);
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
    let message = "Ziyaul Weds Thaieba\nYou are invited. Consider this as Our Personal Invite.\nRequest Your Esteemed Presence on Our Wedding Day.\nDownload Our Invite App From Google Play Store Now to Get Started.";
    let subject = "Download Invite App";
    let file = null;
    let url = "https://play.google.com/store/apps/details?id=com.ziyaul.wedhub";
    this.socialSharing.share(message, subject, file, url).then(() => {
      // Success!
    }).catch(() => {
      // Error!
    });
  }

  LauchNavigate() {
    this.launchNavigator.navigate("Jamia Masjid, V Kalathur, Perambalur");
  }
  // OpenWhatsapp() {
  //   this.iab.create('https://wa.me/919688333128', '_blank', 'hideurlbar=yes');
  // }
  SendRSVP() {
    this.loginProvider.getRSVPStatus().then(
      result => {
        if (!result) {
          this.showRSVPModal();
        }
        else {
          this.showAlert('Confirm Update?', 'You have already sent RSVP. Do you wish to update your RSVP?');
        }
      },
      err => {
        this.commonProvider.presentAlert("Error", "Please Try Again Later.");
      });
  }

  showRSVPModal() {
    this.modalOn = true;
    this.data.created = new Date().toISOString();
    let message = 'Will you be able to make it to our Wedding?';
    let inputs = [
      {
        type: 'radio',
        label: 'Yes. I will',
        value: 'Yes'
      },
      {
        type: 'radio',
        label: 'Not Sure. But I will Try',
        value: 'Maybe'
      },
      {
        type: 'radio',
        label: 'Sorry. I can\'t',
        value: 'No'
      }
    ];
    let prompt = this.showRadioPrompt(message, inputs);
    prompt.present();
    prompt.onDidDismiss(response => {
      this.data.attend = response;
      if (response === 'No') {
        this.commonProvider.addData(this.data);
        this.clearData();
        this.commonProvider.presentAlert("Sorry " + this.data.name, "But, We will be Missing You.")
      }
      else {
        message = "Do you like us to arrange for your Accomodation?"
        inputs = [
          {
            type: 'radio',
            label: 'Yes. Indeed',
            value: 'Yes'
          },
          {
            type: 'radio',
            label: 'Not Sure.',
            value: 'Maybe'
          },
          {
            type: 'radio',
            label: 'No. Thanks',
            value: 'No'
          }
        ];
        prompt = this.showRadioPrompt(message, inputs);
        prompt.present();
        prompt.onDidDismiss(response => {
          this.data.accomodation = response;
          if (response === 'No') {
            this.commonProvider.addData(this.data);
            this.clearData();
            this.commonProvider.presentAlert("Thanks " + this.data.name, "We are happy and will look forward to Welcome You.")
          }
          else {
            message = "Can you help us with Head count for Accomodation?"
            inputs = [
              {
                type: 'radio',
                label: 'I am Single, Only One.',
                value: '1'
              },
              {
                type: 'radio',
                label: 'I am Commited, We\'re Two.',
                value: '2'
              },
              {
                type: 'radio',
                label: 'We\'re Family, Two Plus.',
                value: '3'
              }
            ];
            prompt = this.showRadioPrompt(message, inputs);
            prompt.present();
            prompt.onDidDismiss(response => {
              this.data.count = response;
              this.commonProvider.addData(this.data);
              this.clearData();
              this.commonProvider.presentAlert("Thanks " + this.data.name, "We are happy and will look forward to Welcome You.")
            });
          }
        });
      }
    })
  }

  clearData() {
    this.modalOn = false;
    this.data.attend = null;
    this.data.accomodation = null;
    this.data.count = null;
    this.loginProvider.saveRSVPStatus(true);
    this.commonProvider.db.database.goOffline();
  }

  showAlert(title, message) {
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.showRSVPModal();
          }
        }
      ]
    });
    alert.present();
  }

  showRadioPrompt(message, inputs) {
    {
      let prompt = this.alertCtrl.create({
        title: 'RSVP',
        message: message,
        inputs: inputs,
        buttons: [
          {
            text: "Next",
            handler: data => {
              if (data) {
                // prompt.(true);
                return data;
              }
              else {
                this.commonProvider.presentToast("Select Anyone Option");
                return false;
                // prompt.setMessage('Your validation message');
                // prompt.dismiss(false);
              }
              // console.log("search clicked");
            }
          }],
        enableBackdropDismiss: false
      });
      return prompt;
    }
  }

  More() {
    this.navCtrl.push("MorePage");
  }
}

import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@Component({
  templateUrl: 'about.html'
})
export class AboutPage {

  constructor(private navCtrl: NavController, private iab: InAppBrowser) {
  }

  openUrl(url) {
    const browser = this.iab.create(url, '_blank', 'location=yes');
    
  }
}
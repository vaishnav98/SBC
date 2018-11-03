import {Component, ViewChild, OnInit } from '@angular/core';
import {Platform, MenuController, ViewController, Events, ModalController, NavController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Subscription } from '../../node_modules/rxjs/Subscription';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { SQLite } from '@ionic-native/sqlite';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Uid } from '@ionic-native/uid';
import { SocialSharing } from '@ionic-native/social-sharing';

import { AuthService } from '../shared/services/auth.service';
import { DataService } from '../shared/services/data.service';
import { SqliteService } from '../shared/services/sqlite.service';
import {TabsPage} from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';


declare var window: any;

@Component({
  templateUrl: 'app.html'
})
export class ForumApp implements OnInit {
  @ViewChild('content') nav: any;

  public rootPage: any;
  public loginPage: LoginPage;

  connectSubscription: Subscription;

  constructor(platform: Platform,
    public dataService: DataService,
    public authService: AuthService,
    public sqliteService: SqliteService,
    public menu: MenuController,
    public events: Events,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private network: Network,
    private sqlite: SQLite,
    private photoViewer: PhotoViewer,
    private camera: Camera,
    private iab: InAppBrowser,
    private uid: Uid,
    public ga: GoogleAnalytics,
    public socialSharing: SocialSharing,
    public modalCtrl: ModalController) {
    var self = this;
    this.rootPage = TabsPage;

    platform.ready().then(() => {
      console.log('in ready..');
      let array: string[] = platform.platforms();
      console.log(array);
      this.sqliteService.InitDatabase();
        // Okay, so the platform is ready and our plugins are available.
        // Here you can do any higher level native things you might need.
        this.statusBar.styleDefault();
        this.watchForConnection();
        this.watchForDisconnect();
        this.splashScreen.hide();
        this.ga.startTrackerWithId('');
  
    if (window.cordova, typeof this.ga !== 'undefined') {   
        this.ga.startTrackerWithId('UA-XXXXXXXX-XX')
        .then(() => {
          console.log('Google analytics is ready now');
             this.ga.trackView('threads');
          // Tracker is ready
          // You can now track pages or set additional information such as AppVersion or UserId
        })
        .catch(e => console.log('Error starting GoogleAnalytics', e));
      }
    });
  }

  watchForConnection() {
    var self = this;
    this.network.onConnect().subscribe(() => {
      console.log('network connected!');
      // We just got a connection but we need to wait briefly
      // before we determine the connection type.  Might need to wait
      // prior to doing any api requests as well.
      setTimeout(() => {
        console.log('we got a connection..');
        console.log('Server: Go Online..');
        self.dataService.goOnline();
        self.events.publish('network:connected', true);
      }, 3000);
    });
  }

  watchForDisconnect() {
    var self = this;
    // watch network for a disconnect
    this.network.onDisconnect().subscribe(() => {
      console.log('network was disconnected :-(');
      console.log('Server: Go Offline..');
      //self.sqliteService.resetDatabase();
      self.dataService.goOffline();
      self.events.publish('network:connected', false);
    });
  }

  hideSplashScreen() {
    if (this.splashScreen) {
      setTimeout(() => {
        this.splashScreen.hide();
      }, 3000);
    }
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    var self = this;

    this.authService.onAuthStateChanged(function (user) {
      if (user === null) {
        self.menu.close();
        //self.nav.setRoot(LoginPage);

        let loginodal = self.modalCtrl.create(LoginPage);
        loginodal.present();
      }
    });
  }

  openPage(page) {
    let viewCtrl: ViewController = this.nav.getActive();
    // close the menu when clicking a link from the menu
    this.menu.close();

    if (page === 'signup') {
      if (!(viewCtrl.instance instanceof SignupPage))
        this.nav.push(SignupPage);
    }
  }

  signout() {
    var self = this;
    self.menu.close();
    self.authService.signOut();
  }

  isUserLoggedIn(): boolean {
    let user = this.authService.getLoggedInUser();
    return user !== null;
  }

  shareSheetShare() {
    this.socialSharing.share("Share message", "Share subject", "URL to file or image", "A URL to share").then(() => {
      console.log("shareSheetShare: Success");
    }).catch(() => {
      console.error("shareSheetShare: failed");
    });
  }
}
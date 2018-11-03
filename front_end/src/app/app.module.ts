import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { IonicApp, IonicModule } from 'ionic-angular';
import { ForumApp } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { Network } from '@ionic-native/network';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { IonicStorageModule } from '@ionic/storage';
import { SQLite } from '@ionic-native/sqlite';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Uid } from '@ionic-native/uid';
import { SocialSharing } from '@ionic-native/social-sharing';

// Pages
import { AboutPage } from '../pages/about/about';
import { CommentCreatePage } from '../pages/comment-create/comment-create';
import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { SignupPage } from '../pages/signup/signup';
import { TabsPage } from '../pages/tabs/tabs';
import { ThreadCommentsPage } from '../pages/thread-comments/thread-comments';
import { ThreadCreatePage } from '../pages/thread-create/thread-create';
import { ThreadsPage } from '../pages/threads/threads';
// Custom components
import { ThreadComponent } from '../shared/components/thread.component';
import { AccordionComponent } from '../shared/components/accordion';

import { UserAvatarComponent } from '../shared/components/user-avatar.component';
// providers
import { APP_PROVIDERS } from '../providers/app.providers';

@NgModule({
  declarations: [
    ForumApp,
    AboutPage,
    CommentCreatePage,
    LoginPage,
    ProfilePage,
    SignupPage,
    TabsPage,
    ThreadCommentsPage,
    ThreadCreatePage,
    ThreadsPage,
    ThreadComponent,
    UserAvatarComponent,
    AccordionComponent
  ],
  imports: [
    IonicStorageModule.forRoot(),        
    IonicModule.forRoot(ForumApp),
    HttpModule,
    FormsModule,
    BrowserModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ForumApp,
    AboutPage,
    CommentCreatePage,
    LoginPage,
    ProfilePage,
    SignupPage,
    TabsPage,
    ThreadCommentsPage,
    ThreadCreatePage,
    ThreadsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Network,
    SQLite,
    GoogleAnalytics,
    PhotoViewer,
    Camera,
    InAppBrowser,
    SocialSharing,
    Uid,
    APP_PROVIDERS]
})
export class AppModule {}

import {Component, OnInit} from '@angular/core';
import {NavController, LoadingController, ActionSheetController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';

import { IUser } from '../../shared/interfaces';
import { AuthService } from '../../shared/services/auth.service';
import { DataService } from '../../shared/services/data.service';

@Component({
  templateUrl: 'profile.html'
})
export class ProfilePage implements OnInit {
  userDataLoaded: boolean = false;
  user: IUser;
  username: string;
  userProfile = {};
  firebaseAccount: any = {};
  userStatistics: any = {};

  constructor(public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public actionSheeCtrl: ActionSheetController,
    public authService: AuthService,
    private camera: Camera,
    public dataService: DataService) { }

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    var self = this;
    self.userDataLoaded = false;
    
    self.getUserData().then(function (snapshot) {
      let userData: any = snapshot.val();

      self.getUserImage().then(function (url) {
        self.userProfile = {
          username: userData.username,
          dateOfBirth: userData.dateOfBirth,
          image: url,
          totalFavorites: userData.hasOwnProperty('favorites') === true ?
            Object.keys(userData.favorites).length : 0
        };

        self.user = {
          uid : self.firebaseAccount.uid,
          username : userData.username
        };

        self.userDataLoaded = true;
      }).catch(function (error) {
        console.log(error.code);
        self.userProfile = {
          username: userData.username,
          dateOfBirth: userData.dateOfBirth,
          image: 'assets/images/profile.png',
          totalFavorites: userData.hasOwnProperty('favorites') === true ?
            Object.keys(userData.favorites).length : 0
        };
        self.userDataLoaded = true;
      });
    });

    self.getUserThreads();
    self.getUserComments();
  }

  getUserData() {
    var self = this;

    self.firebaseAccount = self.authService.getLoggedInUser();
    return self.dataService.getUser(self.authService.getLoggedInUser().uid);
  }

  getUserImage() {
    var self = this;

    return self.dataService.getStorageRef().child('images/' + self.firebaseAccount.uid + '/profile.png').getDownloadURL();
  }

  getUserThreads() {
    var self = this;

    self.dataService.getUserThreads(self.authService.getLoggedInUser().uid)
      .then(function (snapshot) {
        let userThreads: any = snapshot.val();
        if (userThreads !== null) {
          self.userStatistics.totalThreads = Object.keys(userThreads).length;
        } else {
          self.userStatistics.totalThread = 0;
        }
      });
  }

  getUserComments() {
    var self = this;

    self.dataService.getUserComments(self.authService.getLoggedInUser().uid)
      .then(function (snapshot) {
        let userComments: any = snapshot.val();
        if (userComments !== null) {
          self.userStatistics.totalComments = Object.keys(userComments).length;
        } else {
          self.userStatistics.totalComments = 0;
        }
      });
  }

  openImageOptions() {
    var self = this;

    let actionSheet = self.actionSheeCtrl.create({
      title: 'Upload new image from',
      buttons: [
        {
          text: 'Camera',
          icon: 'camera',
          handler: () => {
            self.openCamera(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Album',
          icon: 'folder-open',
          handler: () => {
            self.openCamera(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        }
      ]
    });

    actionSheet.present();
  }

  openCamera(pictureSourceType: any) {
    var self = this;

    let options: CameraOptions = {
      quality: 95,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: pictureSourceType,
      encodingType: this.camera.EncodingType.PNG,
      targetWidth: 400,
      targetHeight: 400,
      saveToPhotoAlbum: true,
      correctOrientation: true
    };

    this.camera.getPicture(options).then(imageData => {
      const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
        const byteCharacters = atob(b64Data);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
          const slice = byteCharacters.slice(offset, offset + sliceSize);

          const byteNumbers = new Array(slice.length);
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }

          const byteArray = new Uint8Array(byteNumbers);

          byteArrays.push(byteArray);
        }

        const blob = new Blob(byteArrays, { type: contentType });
        return blob;
      };

      let capturedImage: Blob = b64toBlob(imageData, 'image/png');
      self.startUploading(capturedImage);
    }, error => {
      console.log('ERROR -> ' + JSON.stringify(error));
    });
  }

  reload() {
    this.loadUserProfile();
  }

  startUploading(file) {

    let self = this;
    let uid = self.authService.getLoggedInUser().uid;
    let progress: number = 0;
    // display loader
    let loader = this.loadingCtrl.create({
      content: 'Uploading image..',
    });
    loader.present();

    // Upload file and metadata to the object 'images/mountains.jpg'
    var metadata = {
      contentType: 'image/png',
      name: 'profile.png',
      cacheControl: 'no-cache',
    };

    var uploadTask = self.dataService.getStorageRef().child('images/' + uid + '/profile.png').put(file, metadata);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on('state_changed',
      function (snapshot) {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      }, function (error) {
        loader.dismiss().then(() => {
          switch (error.code) {
            case 'storage/unauthorized':
              // User doesn't have permission to access the object
              break;

            case 'storage/canceled':
              // User canceled the upload
              break;

            case 'storage/unknown':
              // Unknown error occurred, inspect error.serverResponse
              break;
          }
        });
      }, function () {
        loader.dismiss().then(() => {
          // Upload completed successfully, now we can get the download URL
          var downloadURL = uploadTask.snapshot.downloadURL;
          self.dataService.setUserImage(uid);
          self.reload();
        });
      });
  }
}
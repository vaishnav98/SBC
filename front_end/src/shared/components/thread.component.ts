import { Component, EventEmitter, OnInit, OnDestroy, Input, Output, ViewChild, Renderer } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';

import { IThread } from '../interfaces';
import { DataService } from '../services/data.service';


    @Component({
      selector: 'forum-thread',
      templateUrl: 'thread.component.html'
  })

export class ThreadComponent implements OnInit, OnDestroy {
    @Input() thread: IThread;
    @Output() onViewComments = new EventEmitter<string>();

    constructor(private dataService: DataService, public navCtrl: NavController,
        private socialSharing: SocialSharing) { }

    ngOnInit() {
        var self = this;
        self.dataService.getThreadsRef().child(self.thread.key).on('child_changed', self.onCommentAdded);
    }

    ngOnDestroy() {
         console.log('destroying..');
        var self = this;
        self.dataService.getThreadsRef().child(self.thread.key).off('child_changed', self.onCommentAdded);
    }

    // Notice function declarion to keep the right this reference
    public onCommentAdded = (childSnapshot, prevChildKey) => {
       console.log(childSnapshot.val());
        var self = this;
        // Attention: only number of comments is supposed to changed.
        // Otherwise you should run some checks..
        self.thread.comments = childSnapshot.val();
    }

    viewComments(key: string) {
        this.onViewComments.emit(key);
    }

    shareSheetShare() {
        this.socialSharing.share("Share message", "{{threads.title}}", "URL to file or image", "A URL to share").then(() => {
          console.log("shareSheetShare: Success");
        }).catch(() => {
          console.error("shareSheetShare: failed");
        });
      }

}
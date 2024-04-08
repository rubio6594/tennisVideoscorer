import { Component, HostListener, Inject, Input, OnInit, Signal, effect } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Match } from '../models/match';
import { ScreenService } from '../services/screen.service';
import { MatchService } from '../services/match.service';
import { Screen } from '../models/screen';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-screen',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './screen.component.html',
  styleUrls: ['./screen.component.scss'],
})
export class ScreenComponent implements OnInit{

  @Input() enableFullScreen : boolean = true;
  matchSignal?: Signal<Match>;
  screenSignal?: Signal<Screen>;
  showVideo: boolean = false;
  current = 0;
  bannerInterval: any;
  timeInterval: any;
  serveInterval: any;
  bannerTime : number = 5;
  fullScreen: boolean = false;
  time: number = 0;
  serveTime: number = 20;
  showServeTime: boolean = false;
  now: Date = new Date();
  @HostListener('document:fullscreenchange', ['$event'])
  @HostListener('document:webkitfullscreenchange', ['$event'])
  screenChange(event: any) {
    this.fullScreen = !this.fullScreen;
  }
  

  constructor(private screenService: ScreenService, private matchService: MatchService, @Inject(DOCUMENT) private document: any) {
    this.screenSignal = this.screenService.screen;
    this.matchSignal = this.matchService.match;
    setInterval(() => {
      this.now = new Date();
    }, 1000);
    effect(() => {
      if(this.screenSignal) {
        console.log("change");
        this.showVideo = this.screenSignal().video != "";
        if(this.bannerTime != this.screenSignal().bannerTime) {
          this.bannerTime = this.screenSignal().bannerTime;
          this.startBanners()
        }

        if(this.screenSignal().bottomBanner.length > 0 && this.screenSignal().showBanner) {
          console.log("startBanners");
          this.bannerTime = this.screenSignal().bannerTime;
          this.startBanners();
        } else {
          clearInterval(this.bannerInterval)
        }
      }
    })

    effect(() => {
      if(this.matchSignal) {
        if(this.matchSignal().timeRunning) {
          this.startTime();
        } else {
          this.stopTime();
        }

        if(this.matchSignal().serveRunning) {
          console.log("serve running")
          this.startServeTime();
        } else {
          this.stopServeTime();
        }

        if(this.matchSignal().time === 0) {
          this.time = 0;
        }
      }
    })
  }

  ngOnInit(): void {
    if(this.screenService.screen().bottomBanner.length > 0 && this.screenService.screen().showBanner) {
      this.startBanners()
    }
  }

  endVideo() {
   this.screenService.endVideo();    
   this.showVideo = false;
   this.screenSignal!().video="";
  }

  openFullScreen() {
    document.documentElement.requestFullscreen();
  }

  startBanners() {
    console.log("Start interval");
    console.log(this.bannerTime);
    try {
      clearInterval(this.bannerInterval);
    } catch(e) {}
    this.bannerInterval = setInterval(() => {
      this.current = ++this.current % this.screenSignal!().bottomBanner.length;
    }, this.bannerTime * 1000);
  }

  startTime() {
    try {
      clearInterval(this.timeInterval);
    } catch(e) {}
    this.timeInterval =  setInterval(() => {
      this.time ++;
    }, 1000);
  }

  stopTime() {
    try {
      clearInterval(this.timeInterval);
    } catch(e) {}
  }

  startServeTime() {
    try {
      clearInterval(this.serveInterval);
    } catch(e) {}
    this.showServeTime = true;
    this.serveInterval =  setInterval(() => {
      if(this.serveTime > 0) {
        this.serveTime --;
      } else {
        this.stopServeTime();
      }
    }, 1000);
  }

  stopServeTime() {
    try {
      clearInterval(this.serveInterval);
    } catch(e) {}
    this.serveTime = 20;
    this.showServeTime = false;
  }

  calcTime() {
    const seconds = this.time % 60;
    let minutes = Math.floor(this.time / 60);
    const hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    const secondsString = seconds > 10? seconds: "0" + seconds;
    const hoursString = hours > 10? hours: "0" + hours;
    const minutesString = minutes > 10? minutes: "0" + minutes;
    return hoursString + ":" + minutesString + ":" + secondsString;
  }



  calcWinSets(playerNumber: 1 | 2) {
    return this.matchSignal!().sets.filter(set => set.won === playerNumber).length;
  } 

  get superTiebreak() {
   return this.matchSignal!().supertiebreak && ((this.matchSignal!().sets3 && (this.matchSignal!().sets.filter(set => set.won === 1).length === 1 && this.matchSignal!().sets.filter(set => set.won === 2).length === 1)) || 
        (!this.matchSignal!().sets3 && (this.matchSignal!().sets.filter(set => set.won === 1).length === 2 && this.matchSignal!().sets.filter(set => set.won === 2).length === 2)));
  }
}

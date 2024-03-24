import { Component, Input, OnInit, Signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Match } from '../models/match';
import { ScreenService } from '../services/screen.service';
import { MatchService } from '../services/match.service';
import { Screen } from '../models/screen';
import { SlickCarouselModule } from 'ngx-slick-carousel';

@Component({
  selector: 'app-screen',
  standalone: true,
  imports: [CommonModule, SlickCarouselModule],
  templateUrl: './screen.component.html',
  styleUrls: ['./screen.component.scss'],
})
export class ScreenComponent implements OnInit{

  matchSignal?: Signal<Match>;
  screenSignal?: Signal<Screen>;
  showVideo: boolean = false;
  current = 0;
  bannerInterval: any;
  bannerTime : number = 5000;

  constructor(private screenService: ScreenService, private matchService: MatchService) {
    this.screenSignal = this.screenService.screen;
    this.matchSignal = this.matchService.match;

    effect(() => {
      if(this.screenSignal) {
        this.showVideo = this.screenSignal().video != "";
        if(this.bannerTime != this.screenSignal().bannerTime) {
          clearInterval(this.bannerInterval);
          this.bannerTime = this.screenSignal().bannerTime;
          this.bannerInterval =  this.bannerInterval = setInterval(() => {
            console.log(this.screenSignal!().bottomBanner.length);
            this.current = ++this.current % this.screenSignal!().bottomBanner.length;
          }, this.bannerTime);
        }
      }
    })
  }

  ngOnInit(): void {
    this.bannerInterval =  this.bannerInterval = setInterval(() => {
      console.log(this.screenSignal!().bottomBanner);
      this.current = ++this.current % this.screenSignal!().bottomBanner.length;
    }, this.bannerTime);
  }

  endVideo() {
    this.screenService.endVideo();    
    this.showVideo = false;
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Match } from 'src/app/models/match';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { ScreenComponent } from 'src/app/screen/screen.component';
import { ConsolePlayerComponent } from '../console-player/console-player.component';
import { SettingsComponent } from '../settings/settings.component';
import { MatchService } from 'src/app/services/match.service';
import { FormsModule } from '@angular/forms';
import { ScreenService } from 'src/app/services/screen.service';
import {MatInputModule} from '@angular/material/input';

@Component({
  selector: 'app-console-match',
  standalone: true,
  imports: [CommonModule, ConsolePlayerComponent, SettingsComponent, ScreenComponent, MatCheckboxModule, MatSelectModule, FormsModule, MatInputModule],
  templateUrl: './console-match.component.html',
  styleUrls: ['./console-match.component.scss']
})
export class ConsoleMatchComponent {
  match?: Match;

  constructor(private matchService: MatchService, private screenService: ScreenService) {}

  ngOnInit(): void {
    this.match = this.matchService.match();
    
  }

  updatePoints(my: 1 | 2, other: 1 | 2, add: boolean) {
    this.matchService.updatePoints(my, other, add);
  }

  newMatch() {
    this.match =  { 
      id:0,
      player1: {name:"Player1", image:"", subname:"", info:""},
      player2: {name:"Player2", image:"", subname:"", info:""},
      points1: 0,
      points2: 0,
      sets: [{
        won: 0,
        games1: 0,
        games2: 0
      }],
      serve: true,
      goldenPoint: false,
      time: 0,
      totalSets: true,
      tiebreak: false,
      timeRunning: false,
      serveRunning: false,
      round: "",
      sets3: true,
      supertiebreak: false
  };
    this.matchService.newMatch();
  }

  updateShowTotalSets() {
    const showTotalSets = this.match?.totalSets;
    this.matchService.showTotalSets(!showTotalSets);
  }

  controlTime(timeRunning: boolean) {
    this.matchService.controlTime(timeRunning)
  }

  showPresentation() {
    this.screenService.togglePresentation();
  }

  controlServeTime() {
    const serveTime = this.match?.serveRunning;
    this.matchService.controlServeTime(!serveTime);
  }

  saveMatch() {
    console.log("save");
    this.matchService.updateMatchData(this.match!);
  }

  showAce() {
      this.screenService.screen!().video = "./assets/video/ace.mp4";
      this.screenService.updateScreen(this.screenService.screen!());
  }
}

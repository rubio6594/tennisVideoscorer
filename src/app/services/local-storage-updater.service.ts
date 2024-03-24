import { ScreenService } from './screen.service';
import { Injectable } from '@angular/core';
import { Match } from '../models/match';
import { Screen } from '../models/screen';
import { MatchService } from './match.service';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageUpdateService {

  constructor() { 
  }

  updateMatch(match: Match) {
    localStorage.setItem('match', JSON.stringify(match));
    localStorage.setItem("update", "match");
  }

  updateScreen(screen: Screen) {
    localStorage.setItem('screen', JSON.stringify(screen));
    localStorage.setItem("update", "screen");
  }

  updateBanners() {
    localStorage.setItem("update", "banner");
  }

  updateVideos() {
    localStorage.setItem("update", "video");
  }

  updateBackgrounds() {
    localStorage.setItem("update", "background");
  }

  updatePlayers() {
    localStorage.setItem("update", "player");
  }


}

import { Injectable } from '@angular/core';
import { MatchService } from './match.service';
import { ScreenService } from './screen.service';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageListenerService {

  constructor(private screenService: ScreenService, private matchService: MatchService) {
    window.addEventListener('storage', () => {
      const update = localStorage.getItem('update');
      if(update) {
        switch(update) {
          case "match": 
            this.matchService.updateMatch();
            localStorage.removeItem("update");
            break;
          case "screen":
            this.screenService.updateScreenLocalStorage();
            localStorage.removeItem("update");
            break;
          case "videosUpdated":
            this.screenService.updateVideos();
            localStorage.removeItem("update");
            break;
          case "bannersUpdated":
            this.screenService.updateBanners();
            localStorage.removeItem("update");
            break;
          case "backgroundsUpdated":
            this.screenService.updateBackgrounds();
            localStorage.removeItem("update");
            break;
          case "playersUpdated":
            this.matchService.updatePlayers();
            localStorage.removeItem("update");
            break;
        }
        
      }
    });
   }
}

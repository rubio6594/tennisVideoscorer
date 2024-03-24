import { Injectable, WritableSignal, signal } from '@angular/core';
import { Match, Point, Player } from '../models/match';
import { LocalStorageUpdateService } from './local-storage-updater.service';
import { Screen } from '../models/screen';

@Injectable({
  providedIn: 'root'
})
export class MatchService {
    match: WritableSignal<Match> = signal(
      { 
        id:0,
        player1: {name:"Player1", image:""},
        player2: {name:"Player1", image:""},
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
        tiebreak: false
    });
  
    players: WritableSignal<string[]> = signal([]);
    points : Point[] = [0, 15, 30, 40, 'Adv'];
  
    constructor(private localStorageService: LocalStorageUpdateService) {
      const match = localStorage.getItem('match');
      if(match) {
        this.match.set(JSON.parse(match))
      }
    }
  
    updatePlayer(playerNumber: 1 | 2, player: Player) {
      this.match.update(match => {
        match[`player${playerNumber}`] = player;
        this.localStorageService.updateMatch(match);
        return match;
      });
    }
  
    updatePoints(my: 1 | 2, other: 1 | 2, add: boolean) {
      this.match.update(match => {
        let tiebreak = match.tiebreak;
        let myPoints = match[`points${my}`];
        let otherPoints = match[`points${other}`];
        if(add) {
          const cP = this.checkPoint(myPoints, otherPoints, tiebreak);
          if(cP === "SP") {
            if(tiebreak) {
              match[`points${my}`] = myPoints as number + 1;
            } else {
              match[`points${my}`] = this.points[this.points.indexOf(myPoints) + 1]
            }
          } else if(cP === "SG") {
            let set = match.sets[match.sets.length - 1];
            const cG = this.checkGame(set[`games${my}`], set[`games${other}`]);
            if(cG === "SG") {
              match.sets[match.sets.length - 1][`games${my}`] += 1;
              match.points1 = 0;
              match.points2 = 0;
              if(match.sets[match.sets.length - 1][`games${my}`] === 6 && match.sets[match.sets.length - 1][`games${other}`] === 6) {
                match.tiebreak = true;
              }
            } else if(cG === "SS") {
              match.sets[match.sets.length - 1][`games${my}`] += 1;
              match.sets[match.sets.length - 1].won = my;
              match.points1 = 0;
              match.points2 = 0;
              match.tiebreak = false;
              if(match.sets.length<=5) {
                match.sets.push({
                  won:0,
                  games1:0,
                  games2:0
                })
              }
            }
          } else if(cP === "IG") {
            match[`points${other}`] = 40;
          }
        } else {
          if(tiebreak) {
            match[`points${my}`] = myPoints as number- 1;
          } else {
            match[`points${my}`] = this.points[this.points.indexOf(myPoints) - 1]
          }
        }
        this.localStorageService.updateMatch(match);
        return match;
      })
    }
  
    private checkPoint(myPoints: number | Point, otherPoints: number | Point, tb: boolean): "SP" | "SG" | "IG" {
      if(!tb) {
        if((myPoints === 40 && otherPoints != 40 && otherPoints != "Adv") || myPoints === "Adv" ) {
          return "SG";
        } else if (myPoints === 40 && otherPoints === "Adv") {
          return "IG";
        } else {
          return "SP"
        }
      } else {
        const mP = myPoints as number;
        const oP = otherPoints as number;
        if(mP > 5 && mP > oP) {
          return "SG";
        } else {
          return "SP";
        }
      }
    }
  
    private checkGame(myGames: number, otherGames: number): "SG" | "SS" {
      if((myGames >= 5 && myGames > otherGames) || myGames === 6) {
        return "SS";
      } else {
        return "SG";
      }
    }

    updateMatch() {
      const match = JSON.parse(localStorage.getItem('match')!);
      this.match.set(match);
    }

    updatePlayersFiles() {
      this.localStorageService.updatePlayers();
    }

    updatePlayers() {
      this.players.set(JSON.parse(localStorage.getItem("playerFiles")!))
    }
  }
  
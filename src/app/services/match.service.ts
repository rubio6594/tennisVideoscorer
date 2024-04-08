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
    });
  
    playersImg: WritableSignal<string[]> = signal([]);
    players: WritableSignal<Player[]> = signal([]);
    points : Point[] = [0, 15, 30, 40, 'AV'];
  
    constructor(private localStorageService: LocalStorageUpdateService) {
      const match = localStorage.getItem('match');
      if(match) {
        this.match.set(JSON.parse(match))
      }

      const players = localStorage.getItem('players');
      if(players) {
        this.players.set(JSON.parse(players))
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
        const tiebreak = match.tiebreak;
        const supertiebreak = match.supertiebreak && ((match.sets3 && (match.sets.filter(set => set.won === 1).length === 1 && match.sets.filter(set => set.won === 2).length === 1)) || 
        (!match.sets3 && (match.sets.filter(set => set.won === 1).length === 2 && match.sets.filter(set => set.won === 2).length === 2)));
        let totalSets = match.sets3? 3 : 5;
        totalSets = match.supertiebreak ? totalSets - 1: totalSets;
        let myPoints = match[`points${my}`];
        let otherPoints = match[`points${other}`];
        if(add) {
          const cP = this.checkPoint(myPoints, otherPoints, tiebreak, supertiebreak);
          console.log(cP)
          if(cP === "SP") {
            if(tiebreak || supertiebreak) {
              match[`points${my}`] = myPoints as number + 1;
            } else {
              match[`points${my}`] = this.points[this.points.indexOf(myPoints) + 1]
            }
            match.serveRunning = true;
          } else if(cP === "SG") {
            let set = match.sets[match.sets.length - 1];
            const cG = this.checkGame(set[`games${my}`], set[`games${other}`]);
            if(cG === "SG") {
              match.sets[match.sets.length - 1][`games${my}`] += 1;
              match.points1 = 0;
              match.points2 = 0;
              match.serve = !match.serve;
              if(match.sets[match.sets.length - 1][`games${my}`] === 6 && match.sets[match.sets.length - 1][`games${other}`] === 6) {
                match.tiebreak = true;
              }
            } else if(cG === "SS") {
              match.sets[match.sets.length - 1][`games${my}`] += 1;
              match.sets[match.sets.length - 1].won = my;
              match.serve = !match.serve;
              match.points1 = 0;
              match.points2 = 0;
              match.tiebreak = false;
              console.log(match.sets3)
              if(match.sets.length<totalSets) {
                match.sets.push({
                  won:0,
                  games1:0,
                  games2:0
                })
              }
            }
          } else if(cP === "IG") {
            match[`points${other}`] = 40;
          } else if (cP === "TS") {
            console.log("terminar set");
            match[`points${my}`] = myPoints as number + 1;
            match.sets.push({
              won:my,
              games1:match.points1 as number,
              games2:match.points2 as number,
            })
            match.points1 = 0;
            match.points2 = 0;
          }
        } else {
          if(tiebreak || supertiebreak) {
            match[`points${my}`] = myPoints as number- 1;
          } else {
            match[`points${my}`] = this.points[this.points.indexOf(myPoints) - 1]
          }
        }
        this.localStorageService.updateMatch(match);
        return match;
      })
    }

    updateGame(my: 1 | 2, other: 1 | 2, add: boolean, setNumber: number) {
      this.match.update(match => {
        if(add) {
        let totalSets = match.sets3? 3 : 5;
        totalSets = match.supertiebreak ? totalSets - 1: totalSets;
        let set = match.sets[setNumber];
            const cG = this.checkGame(set[`games${my}`], set[`games${other}`]);
            if(cG === "SG") {
              match.sets[setNumber][`games${my}`] += 1;
              match.points1 = 0;
              match.points2 = 0;
              if(match.sets[setNumber][`games${my}`] === 6 && match.sets[setNumber][`games${other}`] === 6) {
                match.tiebreak = true;
              }
            } else if(cG === "SS") {
              match.sets[setNumber][`games${my}`] += 1;
              match.sets[setNumber].won = my;
              match.points1 = 0;
              match.points2 = 0;
              match.tiebreak = false;
              console.log(match.sets3)
              if(match.sets.length< totalSets) {
                match.sets.push({
                  won:0,
                  games1:0,
                  games2:0
                })
              }
            }
      } else {
        match.sets[setNumber][`games${my}`] -= 1;
        if(match.sets[setNumber].won === my) {
          match.sets[setNumber].won = 0;
        }
      }
      this.localStorageService.updateMatch(match);
      return match
    })
    }
  
    private checkPoint(myPoints: number | Point, otherPoints: number | Point, tb: boolean, sp: boolean): "SP" | "SG" | "IG" | "TS" {
      if(!tb && !sp) {
        console.log("check tb")
        if((myPoints === 40 && otherPoints != 40 && otherPoints != "AV") || myPoints === "AV" ) {
          return "SG";
        } else if (myPoints === 40 && otherPoints === "AV") {
          return "IG";
        } else {
          return "SP"
        }
      } else if(!sp){
        console.log("check sp")
        const mP = myPoints as number;
        const oP = otherPoints as number;
        if(mP > 5 && mP > oP) {
          return "SG";
        } else {
          return "SP";
        }
      } else {
        console.log("check st")
        const mP = myPoints as number;
        const oP = otherPoints as number;
        if(mP >= 9 && mP > oP) {
          return "TS";
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

    updatePlayersImgFiles() {
      this.localStorageService.updatePlayersImg();
    }

    updatePlayersImg() {
      this.playersImg.set(JSON.parse(localStorage.getItem("playerImgFiles")!))
    }

    updateMatchData(match: Match) {
      this.match.set(match);
      this.localStorageService.updateMatch(match);
    }

    newMatch() {
      this.match.set({ 
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
    });
    this.localStorageService.updateMatch(this.match());
  }

  showTotalSets(show: boolean) {
      this.match.update(match => {
        match.totalSets = show;
        this.localStorageService.updateMatch(match);
        return match;
      })
  }

  controlTime(timeRunning: boolean) {
    this.match.update(match => {
      match.timeRunning = timeRunning;
      match.time = 1;
      this.localStorageService.updateMatch(match);
      return match;
    })
  }

  removeSet(setNumber: number) {
    this.match.update(match => {
      match.sets.splice(setNumber, 1)
      this.localStorageService.updateMatch(match);
      return match;
    })
  }

  savePlayer(player: Player) {
    this.players.update(players => {
      players.push(player);
      this.localStorageService.savePlayers(players);
      return players;
    })
  }

  removePlayer(index:number) {
    this.players.update(players => {
      players.splice(index, 1);
      this.localStorageService.savePlayers(players);
      return players;
    })
  }

  controlServeTime(timeRunning: boolean) {
    this.match.update(match => {
      match.serveRunning = timeRunning;
      this.localStorageService.updateMatch(match);
      return match;
    })
  }
  }
  
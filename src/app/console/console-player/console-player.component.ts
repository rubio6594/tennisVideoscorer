import { Component, Input, OnInit, Signal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchService } from 'src/app/services/match.service';
import {MatIconModule} from '@angular/material/icon';
import { ImagePickerComponent } from 'src/app/image-picker/image-picker.component';
import { MatInputModule } from '@angular/material/input';
import { PlayerPickerComponent } from '../player-picker/player-picker.component';
import { Player } from 'src/app/models/match';

@Component({
  selector: 'app-console-player',
  standalone: true,
  imports: [CommonModule, ImagePickerComponent, MatInputModule, MatIconModule, PlayerPickerComponent],
  templateUrl: './console-player.component.html',
  styleUrls: ['./console-player.component.scss']
})
export class ConsolePlayerComponent implements OnInit{

  @Input() myPlayerNumber: 1 | 2 = 1;
  @Input() otherPlayerNumber: 1 | 2 = 2;

  showImagePicker: boolean = false;
  showPlayerPicker: boolean = false;
  images: Signal<string[]> = signal([]);

  myPoints : 'points1' | 'points2' = `points1`;
  otherPoints: 'points1' | 'points2' = `points2`;
  myGames : 'games1' | 'games2' = `games1`;
  otherGames: 'games1' | 'games2' = `games2`;
  myPlayer: 'player1' | 'player2' = 'player1';
  otherPlayer: 'player1' | 'player2' = 'player2';

  match = this.matchService.match;

  constructor(private matchService: MatchService) {}

  ngOnInit(): void {
  this.myPoints = `points${this.myPlayerNumber}`;
  this.otherPoints = `points${this.otherPlayerNumber}`;
  this.myGames  = `games${this.myPlayerNumber}`;
  this.otherGames = `games${this.otherPlayerNumber}`;
  this.myPlayer  = `player${this.myPlayerNumber}`;
  this.otherPlayer = `player${this.otherPlayerNumber}`;
  }

  addPoint() {
    this.matchService.updatePoints(this.myPlayerNumber, this.otherPlayerNumber, true);
  }

  restPoint() {
    if(this.matchService.match()![this.myPoints] != 0) {
      this.matchService.updatePoints(this.myPlayerNumber, this.otherPlayerNumber, false);
    }
  }

  addGame(set: number) {
    if(this.matchService.match().sets[set].won !== this.myPlayerNumber) {
      this.matchService.updateGame(this.myPlayerNumber, this.otherPlayerNumber, true, set);
    }
  }

  restGame(set: number) {
    if(this.matchService.match().sets[set][`games${this.myPlayerNumber}`] != 0) {
      this.matchService.updateGame(this.myPlayerNumber, this.otherPlayerNumber, false, set);
    }
  }

  selectPlayerImage(image: string) {
    this.match()[this.myPlayer].image = image;
    this.matchService.updateMatchData(this.match());
    this.showImagePicker = false;
  }

  changePlayerName(event: Event) {
    const name = (event.target as HTMLInputElement).value;
    this.match()[this.myPlayer].name = name;
    this.matchService.updateMatchData(this.match());
  }

  changePlayerSubName(event: Event) {
    const subname = (event.target as HTMLInputElement).value;
    this.match()[this.myPlayer].subname = subname;
    this.matchService.updateMatchData(this.match());
  }

  changePlayerInfo(event: Event) {
    const info = (event.target as HTMLInputElement).value;
    this.match()[this.myPlayer].info = info;
    this.matchService.updateMatchData(this.match());
  }

  openPlayerImagePicker() {
    this.matchService.updatePlayersImgFiles();
    this.images = this.matchService.playersImg;
    this.showImagePicker = true;
  }

  changeServe() {
    this.match().serve = this.myPlayerNumber === 1;
    this.matchService.updateMatchData(this.match());
  }

  closeImagePicker() {
    this.showImagePicker = false;
  }

  removeSet(setNumber: number) {
    this.matchService.removeSet(setNumber);
  }

  openPlayerPicker() {
    this.showPlayerPicker = true;
  }

  selectPlayer(player:Player) {
    this.match()[this.myPlayer] = player;
    this.matchService.updateMatchData(this.match());
    this.showPlayerPicker = false;
  }

  closePlayerPicker() {
    this.showPlayerPicker = false;
  }

  savePlayer() {
    this.matchService.savePlayer(this.match()[this.myPlayer]);
  }

}

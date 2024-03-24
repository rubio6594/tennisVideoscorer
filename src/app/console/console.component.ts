import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsoleMatchComponent } from './console-match/console-match.component';
import { SettingsComponent } from './settings/settings.component';


@Component({
  selector: 'app-console',
  standalone: true,
  imports: [CommonModule, ConsoleMatchComponent, SettingsComponent],
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.scss']
})
export class ConsoleComponent {

  showMatch: boolean = true;

 constructor(){
 }

 openMatch() {
  this.showMatch=true;
 }

 openSettings() {
  this.showMatch = false;
 }

}

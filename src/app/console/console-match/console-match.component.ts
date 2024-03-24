import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Match } from 'src/app/models/match';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { ScreenComponent } from 'src/app/screen/screen.component';
import { ConsolePlayerComponent } from '../console-player/console-player.component';
import { SettingsComponent } from '../settings/settings.component';
import { MatchService } from 'src/app/services/match.service';

@Component({
  selector: 'app-console-match',
  standalone: true,
  imports: [CommonModule, ConsolePlayerComponent, SettingsComponent, ScreenComponent, MatCheckboxModule, MatSelectModule],
  templateUrl: './console-match.component.html',
  styleUrls: ['./console-match.component.scss']
})
export class ConsoleMatchComponent {
  match?: Match;

  constructor(private matchService: MatchService) {}

  ngOnInit(): void {
    this.match = this.matchService.match();
    
  }

  updatePoints(my: 1 | 2, other: 1 | 2, add: boolean) {
    this.matchService.updatePoints(my, other, add);
  }
}

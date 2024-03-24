import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ConsoleComponent } from './console/console.component';
import { LocalStorageListenerService } from './services/local-storage-listener.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ConsoleComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'marcadorTenis';

  constructor(private localStorageservice: LocalStorageListenerService) {
  }
}

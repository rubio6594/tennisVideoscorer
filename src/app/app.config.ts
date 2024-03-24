import { ApplicationConfig } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ScreenService } from './services/screen.service';
import { MatchService } from './services/match.service';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes, withHashLocation()), provideAnimations(), ScreenService, MatchService]
};

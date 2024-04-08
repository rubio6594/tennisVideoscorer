import { Injectable, WritableSignal, signal } from '@angular/core';
import { Screen } from '../models/screen';
import { LocalStorageUpdateService } from './local-storage-updater.service';

@Injectable({
  providedIn: 'root'
})
export class ScreenService {
  screen: WritableSignal<Screen> = signal({
    title: "",
    headerBackground: "",
    background: "",
    video: "",
    bottomBanner: [],
    message: "",
    bannerTime: 5000,
    color: "white",
    showPresentation: false,
    showMessage: false,
    messageFullScreen: false,
    showBanner: false
  });

  videos: WritableSignal<string[]> = signal([]);
  backgrounds: WritableSignal<string[]> = signal([]);


  constructor(private localStorageUpdateService: LocalStorageUpdateService) { 
    if(localStorage.getItem('screen')) {
      this.updateScreenLocalStorage();
    }
  }

  updateScreenLocalStorage() {
    const screen = JSON.parse(localStorage.getItem('screen')!);
    this.screen.set(screen);
  }

  updateTitle(title: string) {
    this.screen.update(screen => {
      screen.title = title;
      this.localStorageUpdateService.updateScreen(screen);
      return screen;
    });
  }

  updateScreen(screen: Screen) {
  this.screen.set(screen);
  this.localStorageUpdateService.updateScreen(screen);
  }

  updateVideosFiles() {
    this.localStorageUpdateService.updateVideos();
  }

  updateBannersFiles() {
    this.localStorageUpdateService.updateBanners();
  }

  updateBackgroundFiles() {
    this.localStorageUpdateService.updateBackgrounds();
  }

  updateVideos() {
    this.videos.set(JSON.parse(localStorage.getItem("videoFiles")!))
  }

  updateBanners() {
    this.screen.update(screen =>{
      screen.bottomBanner = (JSON.parse(localStorage.getItem("bannerFiles")!));
      return screen
    })
  }

  updateBackgrounds() {
    this.backgrounds.set(JSON.parse(localStorage.getItem("backgroundFiles")!))
  }

  endVideo() {
    this.screen.update(screen => {
      screen.video = "";
      this.localStorageUpdateService.updateScreen(screen);
      return screen;
    })
  }

  quitBanners() {
    this.screen.update(screen => {
      screen.showBanner = false;
      this.localStorageUpdateService.updateScreen(screen);
      return screen;
    })
  }

  showBanners() {
    this.screen.update(screen => {
      screen.showBanner = true;
      this.localStorageUpdateService.updateScreen(screen);
      return screen;
    })
  }

  togglePresentation() {
    this.screen.update(screen => {
      screen.showPresentation = !screen.showPresentation;
      this.localStorageUpdateService.updateScreen(screen);
      return screen;
    })
  }

  toggleMessage() {
    this.screen.update(screen => {
      screen.showMessage = !screen.showMessage;
      this.localStorageUpdateService.updateScreen(screen);
      return screen;
    })
  }

  toggleMessageFullScreen() {
    this.screen.update(screen => {
      screen.messageFullScreen = !screen.messageFullScreen;
      this.localStorageUpdateService.updateScreen(screen);
      return screen;
    })
  }
}

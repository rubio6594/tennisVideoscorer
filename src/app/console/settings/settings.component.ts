import { Screen } from './../../models/screen';
import { Component, OnInit, Signal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScreenService } from 'src/app/services/screen.service';
import { ScreenComponent } from 'src/app/screen/screen.component';
import {MatInputModule} from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ImagePickerComponent } from 'src/app/image-picker/image-picker.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ScreenComponent, MatInputModule, FormsModule, ImagePickerComponent, MatIconModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit{

  screen?: Screen;
  images: Signal<string[]> = signal([]);
  showBackgroundPicker: boolean = false;
  showBannerPicker: boolean = false;
  showVideoPicker: boolean = false;
  video: string = "";


  constructor(private screenService: ScreenService) {}

  ngOnInit(): void {
    this.screen = this.screenService.screen();
  }

  updateTitle() {
    this.screenService.updateTitle(this.screen!.title);
  }


  getVideos() {
    this.screenService.updateVideosFiles();
  }

  openBackgroundPicker() {
    this.screenService.updateBackgroundFiles();
    this.images = this.screenService.backgrounds;
    this.showBackgroundPicker = true;
  }

  selectBackground(image: string) {
    this.screen!.background = image;
    this.screenService.updateScreen(this.screen!);
    this.showBackgroundPicker = false;
  }

  selectColor(color: string) {
    this.screen!.color = color;
  }

  updateBanners() {
    this.screenService.updateBannersFiles();
    this.screenService.showBanners();
  }

  quitBanners() {
    this.screenService.quitBanners();
  }


  openVideoPicker() {
    this.screenService.updateVideosFiles();
    this.images = this.screenService.videos;
    this.showVideoPicker = true;
  }

  selectVideo(image: string) {
    this.video = image;
    this.showVideoPicker = false;
  }

  playVideo() {
    this.screen!.video = this.video;
    this.screenService.updateScreen(this.screen!);
  }

  stopVideo() {
    this.screen!.video = "";
    this.screenService.endVideo();
  }

  saveScreen() {
    this.screenService.updateScreen(this.screen!);
  }

  closeImagePicker() {
    this.showBackgroundPicker = false;
    this.showBannerPicker = false;
    this.showVideoPicker = false;
  }

  toggleMessage() {
    this.screenService.toggleMessage();
  }

  toggleMessageFullScreen() {
    this.screenService.toggleMessageFullScreen();
  }
}

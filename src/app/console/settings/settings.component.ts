import { Screen } from './../../models/screen';
import { Component, OnInit, Signal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScreenService } from 'src/app/services/screen.service';
import { ScreenComponent } from 'src/app/screen/screen.component';
import {MatInputModule} from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ImagePickerComponent } from 'src/app/image-picker/image-picker.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ScreenComponent, MatInputModule, FormsModule, ImagePickerComponent],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit{

  screen?: Screen;
  images: Signal<string[]> = signal([]);
  showBackgroundPicker: boolean = false;
  showBannerPicker: boolean = false;
  showVideoPicker: boolean = false;


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
  }


  openVideoPicker() {
    this.screenService.updateVideosFiles();
    this.images = this.screenService.videos;
    this.showVideoPicker = true;
  }

  selectVideo(image: string) {
    this.screen!.video = image;
    this.screenService.updateScreen(this.screen!);
    this.showVideoPicker = false;
  }

  saveScreen() {
    this.screenService.updateScreen(this.screen!);
  }
}

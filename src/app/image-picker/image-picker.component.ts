import { Component, EventEmitter, Input, OnInit, Output, Signal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from '../pipes/filter.pipe';
import { ScreenService } from '../services/screen.service';
import { MatchService } from '../services/match.service';

@Component({
  selector: 'app-image-picker',
  standalone: true,
  imports: [CommonModule, FormsModule, FilterPipe],
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss']
})
export class ImagePickerComponent implements OnInit{

  @Input() type: string = "";
  @Output() selectedImage = new EventEmitter<string>();
  @Output() close =  new EventEmitter<string>();
  searchText: string = '';
  images: Signal<string[]> = signal([]);
  constructor(private screenService: ScreenService, private matchService: MatchService) {}

 ngOnInit(): void {
  switch(this.type) {
    case "background":
      this.images = this.screenService.backgrounds;
      break;
    case "video":
      this.images = this.screenService.videos;
      break;
    case "player":
      this.images = this.matchService.playersImg;
  }
 } 
  
  selectImage(image: string) {
    this.selectedImage.emit(image);
  }

  onClose() {
    this.close.emit();
  }

}

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsolePlayerComponent } from './console-player.component';

describe('ConsolePlayerComponent', () => {
  let component: ConsolePlayerComponent;
  let fixture: ComponentFixture<ConsolePlayerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ConsolePlayerComponent]
    });
    fixture = TestBed.createComponent(ConsolePlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

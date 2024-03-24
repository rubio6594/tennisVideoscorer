import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsoleMatchComponent } from './console-match.component';

describe('ConsoleMatchComponent', () => {
  let component: ConsoleMatchComponent;
  let fixture: ComponentFixture<ConsoleMatchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ConsoleMatchComponent]
    });
    fixture = TestBed.createComponent(ConsoleMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

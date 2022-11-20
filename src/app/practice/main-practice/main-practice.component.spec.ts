import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainPracticeComponent } from './main-practice.component';

describe('MainPracticeComponent', () => {
  let component: MainPracticeComponent;
  let fixture: ComponentFixture<MainPracticeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainPracticeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainPracticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

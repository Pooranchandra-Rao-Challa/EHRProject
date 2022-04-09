import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunicationsettingsComponent } from './communicationsettings.component';

describe('CommunicationsettingsComponent', () => {
  let component: CommunicationsettingsComponent;
  let fixture: ComponentFixture<CommunicationsettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommunicationsettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunicationsettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

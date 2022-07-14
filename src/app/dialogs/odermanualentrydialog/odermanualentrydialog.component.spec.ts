import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OdermanualentrydialogComponent } from './odermanualentrydialog.component';

describe('OdermanualentrydialogComponent', () => {
  let component: OdermanualentrydialogComponent;
  let fixture: ComponentFixture<OdermanualentrydialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OdermanualentrydialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OdermanualentrydialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MUReportsComponent } from './mu-reports.component';

describe('MUReportsComponent', () => {
  let component: MUReportsComponent;
  let fixture: ComponentFixture<MUReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MUReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MUReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

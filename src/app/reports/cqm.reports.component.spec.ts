import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CQMReportsComponent } from './cqm.reports.component';

describe('DashboardComponent', () => {
  let component: CQMReportsComponent;
  let fixture: ComponentFixture<CQMReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CQMReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CQMReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

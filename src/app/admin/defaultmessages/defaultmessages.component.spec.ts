import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultmessagesComponent } from './defaultmessages.component';

describe('DefaultmessagesComponent', () => {
  let component: DefaultmessagesComponent;
  let fixture: ComponentFixture<DefaultmessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DefaultmessagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultmessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

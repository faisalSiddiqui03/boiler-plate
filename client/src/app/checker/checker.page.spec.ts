import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckerPage } from './checker.page';

describe('CheckerPage', () => {
  let component: CheckerPage;
  let fixture: ComponentFixture<CheckerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckerPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

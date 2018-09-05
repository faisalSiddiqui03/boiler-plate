import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreSelectionPage } from './store-selection.page';

describe('StoreSelectionPage', () => {
  let component: StoreSelectionPage;
  let fixture: ComponentFixture<StoreSelectionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreSelectionPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreSelectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

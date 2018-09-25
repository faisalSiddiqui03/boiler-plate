import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchLocationPage } from './search-location.page';

describe('SearchLocationPage', () => {
  let component: SearchLocationPage;
  let fixture: ComponentFixture<SearchLocationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchLocationPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchLocationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

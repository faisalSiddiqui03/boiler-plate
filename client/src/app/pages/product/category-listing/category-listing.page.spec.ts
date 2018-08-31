import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryListingPage } from './category-listing.page';

describe('CategoryListingPage', () => {
  let component: CategoryListingPage;
  let fixture: ComponentFixture<CategoryListingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoryListingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryListingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

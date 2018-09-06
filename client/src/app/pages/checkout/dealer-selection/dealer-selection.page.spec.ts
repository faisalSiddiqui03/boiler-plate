import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerSelectionPage } from './dealer-selection.page';

describe('DealerSelectionPage', () => {
  let component: DealerSelectionPage;
  let fixture: ComponentFixture<DealerSelectionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealerSelectionPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealerSelectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreSelectionModalComponent } from './store-selection-modal.component';

describe('StoreSelectionModalComponent', () => {
  let component: StoreSelectionModalComponent;
  let fixture: ComponentFixture<StoreSelectionModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreSelectionModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreSelectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

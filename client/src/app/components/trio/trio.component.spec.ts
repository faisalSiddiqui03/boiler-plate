import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrioComponent } from './trio.component';

describe('PizzaPage', () => {
  let component: TrioComponent;
  let fixture: ComponentFixture<TrioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrioComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

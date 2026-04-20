import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavUsuarios } from './nav-usuarios';

describe('NavUsuarios', () => {
  let component: NavUsuarios;
  let fixture: ComponentFixture<NavUsuarios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavUsuarios],
    }).compileComponents();

    fixture = TestBed.createComponent(NavUsuarios);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

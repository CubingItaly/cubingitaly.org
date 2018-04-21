import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CiToolbarComponent } from './ci-toolbar.component';

describe('CiToolbarComponent', () => {
  let component: CiToolbarComponent;
  let fixture: ComponentFixture<CiToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CiToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CiToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

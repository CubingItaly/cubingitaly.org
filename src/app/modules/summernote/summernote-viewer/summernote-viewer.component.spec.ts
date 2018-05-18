import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummernoteViewerComponent } from './summernote-viewer.component';

describe('SummernoteViewerComponent', () => {
  let component: SummernoteViewerComponent;
  let fixture: ComponentFixture<SummernoteViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummernoteViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummernoteViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

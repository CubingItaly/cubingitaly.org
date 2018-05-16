import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamInfoEditorComponent } from './team-info-editor.component';

describe('TeamInfoEditorComponent', () => {
  let component: TeamInfoEditorComponent;
  let fixture: ComponentFixture<TeamInfoEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamInfoEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamInfoEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlePanelComponent } from './article-panel.component';

describe('ArticlePanelComponent', () => {
  let component: ArticlePanelComponent;
  let fixture: ComponentFixture<ArticlePanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticlePanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticlePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

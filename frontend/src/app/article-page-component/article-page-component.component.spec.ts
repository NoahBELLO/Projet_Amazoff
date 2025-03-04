import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlePageComponentComponent } from './article-page-component.component';

describe('ArticlePageComponentComponent', () => {
  let component: ArticlePageComponentComponent;
  let fixture: ComponentFixture<ArticlePageComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticlePageComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticlePageComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

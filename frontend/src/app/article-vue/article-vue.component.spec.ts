import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleVueComponent } from './article-vue.component';

describe('ArticleVueComponent', () => {
  let component: ArticleVueComponent;
  let fixture: ComponentFixture<ArticleVueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleVueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticleVueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

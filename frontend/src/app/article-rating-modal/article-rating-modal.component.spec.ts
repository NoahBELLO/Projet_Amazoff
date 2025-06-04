import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleRatingModalComponent } from './article-rating-modal.component';

describe('ArticleRatingModalComponent', () => {
  let component: ArticleRatingModalComponent;
  let fixture: ComponentFixture<ArticleRatingModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleRatingModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticleRatingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

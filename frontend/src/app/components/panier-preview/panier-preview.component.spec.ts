import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanierPreviewComponent } from './panier-preview.component';

describe('PanierPreviewComponent', () => {
  let component: PanierPreviewComponent;
  let fixture: ComponentFixture<PanierPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanierPreviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanierPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanierItemComponent } from './panier-item.component';

describe('PanierItemComponent', () => {
  let component: PanierItemComponent;
  let fixture: ComponentFixture<PanierItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanierItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanierItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

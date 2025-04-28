import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanierVueComponent } from './panier-vue.component';

describe('PanierVueComponent', () => {
  let component: PanierVueComponent;
  let fixture: ComponentFixture<PanierVueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanierVueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanierVueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModaleInscriptionComponent } from './modale-inscription.component';

describe('ModaleInscriptionComponent', () => {
  let component: ModaleInscriptionComponent;
  let fixture: ComponentFixture<ModaleInscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModaleInscriptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModaleInscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
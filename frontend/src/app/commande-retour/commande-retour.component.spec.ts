import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandeRetourComponent } from './commande-retour.component';

describe('CommandeRetourComponent', () => {
  let component: CommandeRetourComponent;
  let fixture: ComponentFixture<CommandeRetourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommandeRetourComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommandeRetourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

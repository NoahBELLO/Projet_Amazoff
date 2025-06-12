import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandeBlocComponent } from './commande-bloc.component';

describe('CommandeBlocComponent', () => {
  let component: CommandeBlocComponent;
  let fixture: ComponentFixture<CommandeBlocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommandeBlocComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommandeBlocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

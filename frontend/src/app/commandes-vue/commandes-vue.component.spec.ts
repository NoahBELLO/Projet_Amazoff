import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandesVueComponent } from './commandes-vue.component';

describe('CommandesVueComponent', () => {
  let component: CommandesVueComponent;
  let fixture: ComponentFixture<CommandesVueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommandesVueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommandesVueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

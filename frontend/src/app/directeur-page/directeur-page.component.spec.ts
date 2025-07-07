import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirecteurPageComponent } from './directeur-page.component';

describe('DirecteurPageComponent', () => {
  let component: DirecteurPageComponent;
  let fixture: ComponentFixture<DirecteurPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirecteurPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirecteurPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

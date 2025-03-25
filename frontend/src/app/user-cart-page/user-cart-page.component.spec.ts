import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCartPageComponent } from './user-cart-page.component';

describe('UserCartPageComponent', () => {
  let component: UserCartPageComponent;
  let fixture: ComponentFixture<UserCartPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCartPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserCartPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

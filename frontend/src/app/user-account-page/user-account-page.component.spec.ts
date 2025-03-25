import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAccountPageComponent } from './user-account-page.component';

describe('UserAccountPageComponent', () => {
  let component: UserAccountPageComponent;
  let fixture: ComponentFixture<UserAccountPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserAccountPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserAccountPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

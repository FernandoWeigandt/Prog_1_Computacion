import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit', () => {
    component.submit();
  });

  it('should validate', () => {
    component.loginForm.get('mail')?.setValue('');
    component.loginForm.get('passwd')?.setValue('');
    component.submit();
  });

  it('should auth', () => {
    component.loginForm.get('mail')?.setValue('test');
    component.loginForm.get('passwd')?.setValue('test');
    component.submit();
  });
});

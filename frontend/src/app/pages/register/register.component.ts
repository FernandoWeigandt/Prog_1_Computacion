import { Component } from '@angular/core';
import { ThumbnailBarComponent } from '../../components/thumbnail-bar/thumbnail-bar.component';
import { AuthService } from '../../services/auth.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ThumbnailBarComponent, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styles: ``
})
export class RegisterComponent {

  name = new FormControl('');
  lastname = new FormControl('');
  alias = new FormControl('');
  phone = new FormControl('');
  email = new FormControl('');
  password1 = new FormControl('');
  password2 = new FormControl('');


  constructor(private authService: AuthService) { }

  passwordMatch() {
    return this.password1.value === this.password2.value;
  }

  submit() {
    const dataRegister = {
      name: this.name.valid,
      lastname: this.lastname.value,
      alias: this.alias.value,
      phone: this.phone.value,
      mail: this.email.value,
      passwd: this.password1.value
    }
    this.register(dataRegister);
  }

  register(dataRegister: any) {
    // this.authService.register(dataRegister).subscribe({
    //   next: (response) => {
    //     console.log(response);
    //   },
    //   error: (error) => {
    //     console.error(error);
    //   }
    // });
    console.log(dataRegister);
  }

}

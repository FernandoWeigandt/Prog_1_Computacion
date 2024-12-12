import { Component, inject, Input, OnInit } from '@angular/core';
import { ContextbarComponent } from '../../components/contextbar/contextbar.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotifyService } from '../../services/notify.service';

@Component({
  selector: 'app-notify',
  standalone: true,
  imports: [ContextbarComponent, NavbarComponent, ReactiveFormsModule],
  templateUrl: './notify.component.html',
  styles: ``
})
export class NotifyComponent implements OnInit {
  id: number = 0
  user: any = {}

  private fb = inject(NonNullableFormBuilder)

  notifyForm = this.fb.group({
    title: ['', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(100)
    ]],
    body: ['', [
      Validators.required,
      Validators.minLength(50),
      Validators.maxLength(2000)
    ]],
    note: ['', [
      Validators.minLength(5),
      Validators.maxLength(100)
    ]],
    category: ['info', [
      Validators.required
    ]]
  })

  constructor (
    private route: ActivatedRoute, 
    private usersService: UsersService,
    private notificationService: NotifyService
  ) {}

  ngOnInit() {
    this.id = this.userId
    this.getUser().subscribe((answer: any) => {
      this.user = answer
    })
  }

  displayError(controlName:string): string | null {
    const control = this.notifyForm.get(controlName);
    if (control?.hasError('required')) return 'Este campo es obligatorio';
    if (control?.hasError('minlength')) return `Este campo debe tener al menos ${control.errors?.['minlength'].requiredLength} caracteres`;
    if (control?.hasError('maxlength')) return `Este campo no debe superar los ${control.errors?.['maxlength'].requiredLength} caracteres`;
    return null;
  }

  get userId() {
    return Number(this.route.snapshot.paramMap.get('id'));
  }

  getUser() {
    return this.usersService.getUser(this.id)
  }

  sendNotification() {
    let data = this.notifyForm.value as any
    data = {
      ...data,
      'user_id': this.id
    }
    this.notificationService.postNotification(data).subscribe({
      next: (answer: any) => {
        this.showAlert(`Notificación enviada exitosamente. Destinatario <strong>${this.user.email}</strong>.`, 'success')
        this.notifyForm.reset()
      }, error: (error: any) => {
        this.showAlert('Ocurrio un error al enviar la notificación.', 'danger')
      }
    })
  }

  showAlert(message: string, type: 'danger' | 'success') {
    const alertPlaceholder = document.getElementById('notifyAlertPlaceholder')
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      '</div>'
    ].join('')
    alertPlaceholder?.append(wrapper)
  }

  get titleInvalid(): boolean {
    return this.notifyForm.controls.title.invalid && (this.notifyForm.controls.title.touched || this.notifyForm.controls.title.dirty)
  }

  get bodyInvalid(): boolean {
    return this.notifyForm.controls.body.invalid && (this.notifyForm.controls.body.touched || this.notifyForm.controls.body.dirty)
  }

  get noteInvalid(): boolean {
    return this.notifyForm.controls.note.invalid && (this.notifyForm.controls.note.touched || this.notifyForm.controls.note.dirty)
  }
}

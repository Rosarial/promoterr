import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataRouter } from '@shared/enums/data.router.enum';
import { AuthService, OverlayService } from '@shared/services';
import { DataRouterService } from '@shared/services/data.router.service';
import { finalize, take } from 'rxjs';
import { Geolocation } from '@capacitor/geolocation'; // Importação do Geolocation

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  public loginForm!: FormGroup<any>;
  public hidePwd = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private overlayService: OverlayService,
    private dataRouterService: DataRouterService
  ) {}

  ngOnInit() {
    console.log('onSubmit');
    this.initForm();
    this.getCurrentLocation(); // Chama a função para obter a localização
  }

  async getCurrentLocation() {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      console.log('Current location:', coordinates);
    } catch (error) {
      console.error('Error getting location:', error);
    }
  }

  async onSubmit() {
    const { email, password } = this.loginForm?.value;
    const senha = password;
    const loading = await this.overlayService.loading({
      message: 'Aguarde, autenticando...'
    });

    this.authService
      .login({ email, senha })
      .pipe(
        take(1),
        finalize(() => {
          loading.dismiss();
        })
      )
      .subscribe({
        next: this.handledLoginSuccess.bind(this),
        error: this.handledLoginError.bind(this)
      });
  }

  public showPasswordInput() {
    this.hidePwd = !this.hidePwd;
  }

  private initForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  private handledLoginSuccess(response: any) {
    if (response) {
      this.dataRouterService.setData(DataRouter.USER_INFOR, response);
      const currentuser = response;

      if (currentuser.role === 'supervisor') {
        this.router.navigate(['/supervisor'], { state: { response } })
          .then(() => {})
          .finally(async () => {
            await this.overlayService.toast({
              header: `Autenticado com sucesso`,
              message: `Bem-vindo "Supervisor" ${response?.firstName ?? ''}`,
              color: 'light',
              buttons: ['Ok']
            });
          });
      } else if (currentuser.role === 'admin') {
        this.router.navigate(['/admin'], { state: { response } })
          .then(() => {})
          .finally(async () => {
            await this.overlayService.toast({
              header: `Autenticado com sucesso`,
              message: `Bem-vindo "Administrador" ${response?.firstName ?? ''}`,
              color: 'light',
              buttons: ['Ok']
            });
          });
      }

      this.router.navigate(['/home'], { state: { response } })
        .then(() => {})
        .finally(async () => {
          await this.overlayService.toast({
            header: `Autenticado com sucesso`,
            message: `Bem-vindo "Promotor" ${response?.firstName ?? ''}`,
            color: 'light',
            buttons: ['Ok']
          });
        });
    }
  }

  private handledLoginError(errorResponse: HttpErrorResponse) {
    console.log(errorResponse);
    if (errorResponse.status === 0) {
      this.overlayService.toast({
        color: 'danger',
        icon: 'alert-circle-outline',
        cssClass: 'toast-danger',
        message: 'Verique sua conexão e tente novamente mais tarde'
      });
    } else if (errorResponse.status > 499) {
      this.overlayService.toast({
        color: 'danger',
        icon: 'alert-circle-outline',
        cssClass: 'toast-danger',
        message: 'Erro interno! Volte mais tarde!'
      });
    } else if (errorResponse.status === 404) {
      console.log('errorResponse');
      this.overlayService.toast({
        color: 'danger',
        icon: 'alert-circle-outline',
        cssClass: 'toast-danger',
        message: errorResponse.error['message'] ?? 'Erro interno! tente novamente mais tarde'
      });
    }
  }
}

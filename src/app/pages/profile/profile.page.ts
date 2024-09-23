import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PredefinedColors } from '@shared/interfaces/colors';
import { IProfile, UserRole } from '@shared/interfaces/profile';

import {
  CameraService,
  DeviceInfoService,
  GeolocationService,
  OverlayService,
  ProfileService
} from '@shared/services';
import { UserService } from '@shared/services/user.service';
import { finalize, Subscription, take } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss']
})
export class ProfilePage implements OnInit, OnDestroy {
  profileForm!: FormGroup;
  editMode = true;
  imageProfile: {
    base64Data: string;
    img: string;
  } = {
    base64Data: '',
    img: ''
  };
  currentUserRole!: UserRole;
  private subscriptions$: Subscription[] = [];
  private notTakenewPhoto = true;

  constructor(
    private cameraService: CameraService,
    private fb: UntypedFormBuilder,
    private profileService: ProfileService,
    private deviceInfoService: DeviceInfoService,
    private geolocationService: GeolocationService,
    private overlayService: OverlayService,
    private userService: UserService,
    private router: Router
  ) {}
  ngOnDestroy(): void {
    this.subscriptions$.forEach(sub => sub.unsubscribe());
  }

  ngOnInit() {
    this.initForm();
    const sub = this.userService.currentUser().subscribe(userCurrent => {
      if (userCurrent.id) {
        this.currentUserRole = userCurrent.role;
        this.loadProfile();
      }
    });
    this.subscriptions$.push(sub);
  }

  private initForm() {
    this.profileForm = this.fb.group({
      id: [{ value: '', disabled: true }],
      userId: [{ value: '', disabled: true }],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      photo: [''],
      deviceInfo: [{ value: '', disabled: true }],
      lastLogin: [{ value: '', disabled: true }],
      createdAt: [{ value: '', disabled: true }],
      updatedAt: [{ value: '', disabled: true }],
      role: [{ value: '', disabled: true }],
      currentPosition: [{ value: '', disabled: true }]
    });
  }

  async saveProfile() {
    if (this.profileForm.valid) {
      const currentPosition = this.profileForm.get('currentPosition')?.value;
      const deviceInfo = this.profileForm.get('deviceInfo')?.value;

      let photo = null;

      if (this.notTakenewPhoto) {
        photo = this.profileForm.get('photo')?.value;
      } else {
        photo = this.imageProfile;
      }
      const updatedProfile = this.profileForm.getRawValue();

      delete updatedProfile.lastLogin;
      delete updatedProfile.createdAt;
      delete updatedProfile.updatedAt;

      if (this.currentUserRole !== UserRole.ADMIN) {
        delete updatedProfile.role;
      }

      const payload = {
        ...updatedProfile,
        currentPosition,
        deviceInfo,
        photo
      };

      const loading = await this.overlayService.loading({ message: 'Salvando...' });
      const sub = this.profileService
        .updateProfile(payload)
        .pipe(
          finalize(() => {
            loading.dismiss();
          })
        )
        .subscribe({
          next: value => this.handlerSuccessUpdateProfile(value),
          error: error => this.handlerErrorUpdateProfile(error)
        });
      this.subscriptions$.push(sub);
    } else {
      alert('Por favor, preencha todos os campos');
    }
  }
  handlerErrorUpdateProfile(error: any): void {
    this.toast(
      'Ops!',
      'Erro ao salvar os dados. Tente novamente ou entre em contato com o administrador!'
    );
    console.log(error);
  }
  handlerSuccessUpdateProfile(response: IProfile): void {
    if (response?.firstName) {
      this.userService.updateDataUser(response);
      this.toast('Salvo', 'Seu perfil foi salvo com sucesso!');
    }
    this.editMode = false;
    this.profileForm.disable(); // Disable form after save
  }

  async takePhoto() {
    try {
      const { base64String, base64Data } = await this.cameraService.takePhotoOrChangePhoto(
        'profile'
      );
      if (base64String) {
        this.notTakenewPhoto = false;
        this.imageProfile = {
          base64Data: base64String,
          img: base64Data
        };
      } else {
        this.imageProfile = { base64Data: '', img: '' };
        this.notTakenewPhoto = true;
      }
    } catch (error) {
      console.log(error);
      this.notTakenewPhoto = true;
    }
  }
  public navigateToHome() {
    this.router.navigate(['/home']);
  }
  private async loadProfile() {
    const loading = await this.overlayService.loading({ message: 'Carregando...' });
    const sub = this.profileService
      .getProfile()
      .pipe(
        take(1),
        finalize(() => {
          loading.dismiss();
        })
      )
      .subscribe(profile => {
        this.profileForm.patchValue(profile);
        this.imageProfile.img = profile?.photo || '../../assets/imgs/no-photo-profile.gif';
        this.checkRoleEditability();
        this.fetchCurrentPosition(profile.currentPosition);
        this.fetchDeviceInfo(profile.deviceInfo);
      });
    this.subscriptions$.push(sub);
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
    if (this.editMode) {
      this.profileForm.enable();
      this.profileForm.get('id')?.disable();
      this.profileForm.get('userId')?.disable();
      this.profileForm.get('lastLogin')?.disable();
      this.profileForm.get('createdAt')?.disable();
      this.profileForm.get('updatedAt')?.disable();
      this.profileForm.get('currentPosition')?.disable();
      this.profileForm.get('deviceInfo')?.disable();
      this.checkRoleEditability();
    } else {
      this.profileForm.disable();
      this.loadProfile(); // Reset form if cancel edit mode
    }
  }

  checkRoleEditability() {
    if (this.currentUserRole === UserRole.ADMIN) {
      this.profileForm.get('role')?.enable();
    } else {
      this.profileForm.get('role')?.disable();
    }
    this.profileForm.get('role')?.setValue(this.currentUserRole);
  }

  fetchCurrentPosition(currentPositionFromProfile: any) {
    this.geolocationService.getCurrentPosition().then(position => {
      if (
        !currentPositionFromProfile ||
        currentPositionFromProfile.lat !== position.coords.latitude ||
        currentPositionFromProfile.lng !== position.coords.longitude
      ) {
        this.profileForm.patchValue({
          currentPosition: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
        });
      }
    });
  }

  async fetchDeviceInfo(currentDeviceInfoFromProfile: any) {
    const deviceInfo = await this.deviceInfoService.infoFullDevice();
    if (
      !currentDeviceInfoFromProfile ||
      JSON.stringify(currentDeviceInfoFromProfile) !== JSON.stringify(deviceInfo)
    ) {
      this.profileForm.patchValue({ deviceInfo });
    }
  }

  private toast(header: string, message: string, color: PredefinedColors = 'success') {
    this.overlayService.toast({ header, message, color, duration: 3000 });
  }
}

import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { authenticateGuard } from './guards';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule),
    canActivate: [authenticateGuard]
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then(m => m.FolderPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'checkin',
    loadChildren: () => import('./pages/checkin/checkin.module').then(m => m.CheckinPageModule),
    canActivate: [authenticateGuard]
  },
  {
    path: 'messages',
    loadChildren: () => import('./pages/messages/messages.module').then(m => m.MessagePageModule),
    canActivate: [authenticateGuard]
  },
  {
    path: 'notifications',
    loadChildren: () =>
      import('./pages/notifications/notifications.module').then(m => m.NotificationPageModule),
    canActivate: [authenticateGuard]
  },

  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfilePageModule),
    canActivate: [authenticateGuard]
  },
  {
    path: 'supervisor',
    loadChildren: () =>
      import('./modules/supervisor/supervisor.module').then(m => m.SupervisorPageModule),
    canActivate: [authenticateGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminPageModule),
    canActivate: [authenticateGuard]
  },
  {
    path: 'stores',
    loadChildren: () => import('./modules/stores/stores.module').then(m => m.StoresPageModule),
    canActivate: [authenticateGuard]
  },
  {
    path: 'checkins-checkouts-details',
    loadChildren: () =>
      import('./modules/checkins-checkouts-details/checkins-checkouts-details.module').then(
        m => m.CheckinsCheckoutsDetailsPageModule
      ),
    canActivate: [authenticateGuard]
  },
  {
    path: 'promoters',
    loadChildren: () =>
      import('./modules/promoters/promoters.module').then(m => m.PromotersPageModule),
    canActivate: [authenticateGuard]
  },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}

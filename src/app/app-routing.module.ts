import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';

import { permissionGuard } from './permission.guard';
import { DoctorClaims } from './Models/shared/system-claims';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
      },
      // {
      //   path: 'main',
      //   canActivate: [AuthGuard],
      //   loadComponent: () => import('./demo/dashboard/default/default.component').then((m) => m.DefaultComponent)

      // },
      {
        path: 'main',
        loadComponent: () => import('./demo/dashboard/default/default.component').then((c) => c.DefaultComponent),

      },
      {
        path: 'permission',
        loadComponent: () =>
          import('./shared/error-page/permissoin-page.component/permissoin-page.component').then((c) => c.PermissoinPageComponent)
      },
      {
        path: 'user-permission/:subuserID',
        loadComponent: () => import('./pages/user-permission.component/user-permission.component').then((c) => c.UserPermissionComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile').then((c) => c.Profile)
      },
      {
        path: 'create-address',
        loadComponent: () => import('./pages/create-address.component/create-address.component').then((c) => c.CreateAddressComponent)
      },
      {
        path: 'edit-address',
        loadComponent: () => import('./pages/edit-address-component/edit-address-component').then((c) => c.EditAddressComponent)
      },
      {
        path: 'appointments/view/:id',
        loadComponent: () =>
          import('./pages/Appointment/appointment-view-component/appointment-view-component').then((c) => c.AppointmentViewComponent)
      },
      {
        path: 'appointments',
        loadComponent: () => import('./pages/Appointment/appontment-component/appontment-component').then((c) => c.AppontmentComponent),
        canActivate: [permissionGuard(DoctorClaims.Appointments)]
      },
      {
        path: 'reviews',
        loadComponent: () => import('./pages/reviews.component/reviews.component').then((c) => c.ReviewsComponent)
      },
      {
        path: 'current-availabilities',
        loadComponent: () =>
          import('./pages/current-availlabilities.component/current-availlabilities.component').then(
            (c) => c.CurrentAvaillabilitiesComponent
          )
      },
      {
        path: 'patientHistory/:patientId',
        loadComponent: () => import('./pages/patient-history-component/patient-history-component').then((c) => c.PatientHistoryComponent)
      },
      {
        path: 'view-patient-History/:patientId',
        loadComponent: () =>
          import('./pages/view-patient-history-component/view-patient-history-component').then((c) => c.ViewPatientHistoryComponent)
      },
      {
        path: 'Cancel-Day',
        loadComponent: () =>
          import('./pages/cancel-day-appointement.component/cancel-day-appointement.component').then(
            (c) => c.CancelDayAppointementComponent
          ),
        canActivate: [permissionGuard(DoctorClaims.CancelDayAppointments)]
      },
      {
        path: 'Subuser',
        loadComponent: () => import('./pages/subuser.component/subuser.component').then((c) => c.SubuserComponent)
      },
      {
        path: 'update-Sub-user/:subuserId',
        loadComponent: () => import('./pages/update-subuser.component/update-subuser.component').then((c) => c.UpdateSubuserComponent)
      },
      {
        path: 'create-ticket/:patientId',
        loadComponent: () => import('./pages/tickets/create-tickets.component/create-tickets.component').then((c) => c.CreateTicketsComponent)
      },
      {
        path: 'create-ticket',
        loadComponent: () =>
          import('./pages/tickets/create-tickets.component/create-tickets.component')
            .then(c => c.CreateTicketsComponent)
      },

      {
        path: 'list-ticket',
        loadComponent: () =>
          import('./pages/tickets/list-tickets.component/list-tickets.component')
            .then(c => c.ListTicketsComponent)
      },
      {
        path: 'list-ticket/:patientId',
        loadComponent: () =>
          import('./pages/tickets/list-tickets.component/list-tickets.component')
            .then(c => c.ListTicketsComponent)
      },
      {
        path: 'search-in-patients',
        loadComponent: () =>
          import('./pages/search-in-patients.component/search-in-patients.component')
            .then(c => c.SearchInPatientsComponent)
      },
    ]
  },
  {
    path: '',
    component: GuestComponent,
    children: [
      {
        path: 'login',
        loadComponent: () => import('./demo/pages/authentication/login/login.component').then((c) => c.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./demo/pages/authentication/register/register.component').then((c) => c.RegisterComponent)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

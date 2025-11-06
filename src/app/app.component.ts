// Angular import
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Loader } from './shared/loader/loader';
import { AppointmentSignalRService } from 'src/services/Hubs/AppointmentListenerService';
import { ToastService } from 'src/services/ToastService';
import { jwtDecode } from 'jwt-decode';
import { TranslateService } from '@ngx-translate/core';
import { JwtPayload } from './Models/shared/SharedClasses';
// project import

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterOutlet, Loader]
})
export class AppComponent implements OnInit {
  title = 'Doctor Hero Management';
  private signalR = inject(AppointmentSignalRService);
  private toaster = inject(ToastService);

  private translate = inject(TranslateService);
  constructor() {
    this.translate.addLangs(['en', 'ar']);
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }

  switchLang(lang: string) {
    this.translate.use(lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }

  ngOnInit() {
    const doctorId = this.getDoctorId(); // or get from AuthService / token
    if (doctorId === null) return;
    this.signalR.startConnection(doctorId);

    // Global listener
    this.signalR.onAppointmentReceived((msg) => {
      this.toaster.showNavigation(`${msg.message}`, `/appointments/view/${msg.appointmentId}`, msg.type);
    });
  }


  getToken(): string | null {
    return localStorage.getItem('access_token');
  }


  getDoctorId(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      // assuming your claim is 'doctorId' or maybe 'sub', 'id', etc.
      return decoded.LoggedId || null;
    } catch (e) {
      console.error('Error decoding JWT:', e);
      return null;
    }
  }
}

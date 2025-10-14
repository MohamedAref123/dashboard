// Angular import
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Loader } from './shared/loader/loader';
import { AppointmentSignalRService } from 'src/services/Hubs/AppointmentListenerService';
import { ToastService } from 'src/services/ToastService';
import { jwtDecode } from 'jwt-decode';
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
  ngOnInit() {
    const doctorId = this.getDoctorId(); // or get from AuthService / token
    if (doctorId === null) return;
    this.signalR.startConnection(doctorId);

    // Global listener
    this.signalR.onAppointmentReceived((msg) => {
      this.toaster.show(msg);
    });
  }
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }
  getDoctorId(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token);
      // assuming your claim is 'doctorId' or maybe 'sub', 'id', etc.
      return decoded.LoggedId || null;
    } catch (e) {
      console.error('Error decoding JWT:', e);
      return null;
    }
  }
}

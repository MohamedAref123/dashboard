import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root' // 👈 ensures it's a single instance for the whole app
})
export class AppointmentSignalRService {
  private hubConnection!: signalR.HubConnection;
  private isConnected = false;
  private baseUrl = environment.baseurl.replace('/api', '');
  startConnection(doctorId: string) {
    if (this.isConnected) return; // 👈 prevents reconnecting on every page change

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${this.baseUrl}/hubs/appointments?doctorId=${doctorId}`, {
        withCredentials: true // 👈 this is what triggers AllowCredentials
      })
      .withAutomaticReconnect() // 👈 auto reconnect if connection drops
      .build();

    this.hubConnection
      .start()
      .then(() => {
        this.isConnected = true;
        console.log('SignalR connected as doctor', doctorId);
      })
      .catch((err) => console.error('SignalR connection error:', err));
  }

  onAppointmentReceived(callback: (message: any) => void) {
    if (!this.hubConnection) {
      console.warn('Hub connection not started yet');
      return;
    }

    this.hubConnection.on('AppointmentReceived', callback);
  }

  stopConnection() {
    if (this.hubConnection && this.isConnected) {
      this.hubConnection.stop();
      this.isConnected = false;
    }
  }
}

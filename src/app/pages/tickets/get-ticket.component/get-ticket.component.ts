import { DatePipe, NgClass, NgFor } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TicketDetails, TicketMessage } from 'src/app/Models/tickets/tickets-response';
import { TicketsService } from 'src/services/tickets.service';
import { ToastService } from 'src/services/ToastService';

@Component({
  selector: 'app-get-ticket',
  templateUrl: './get-ticket.component.html',
  styleUrl: './get-ticket.component.scss',
  imports: [NgClass, DatePipe, FormsModule, NgFor, TranslateModule]
})
export class GetTicketComponent implements OnInit {

  route = inject(ActivatedRoute);
  private toaster = inject(ToastService);
  router = inject(Router);
  private ticketsService = inject(TicketsService);

  model!: TicketDetails;


  messages: TicketMessage[] = [];

  ngOnInit(): void {
    const ticketId = this.route.snapshot.paramMap.get('ticketId');

    if (!ticketId) {
      this.toaster.error('No ticket found');
      this.router.navigate(['/dashboard']);
      return;
    }

    this.ticketsService.getTicketById(ticketId).subscribe({
      next: (response) => {
        this.model = response;

      },
      error: () => {
        this.toaster.error('Error loading ticket');
        this.router.navigate(['/dashboard']);
      }
    });

    this.ticketsService.getMessages(ticketId).subscribe({
      next: (res) => {

        this.messages = res;
      }
    });

  }



  newMessage: string = '';

  sendMessage() {
    if (!this.newMessage.trim()) return;

    const body = {
      ticketId: this.model.id,
      senderUserId: 'CURRENT_USER_ID',
      message: this.newMessage
    };

    this.ticketsService.sendMessage(body).subscribe({
      next: () => {

        // 🔥 add locally
        this.messages.push({
          id: 'temp',
          ticketId: this.model.id,
          isSeen: false,
          senderUserId: body.senderUserId,
          message: this.newMessage,
          createdAt: new Date().toISOString(),
          isMine: true
        });

        this.newMessage = '';

        this.toaster.success('Message sent successfully');
      },
      error: () => {
        this.toaster.error('فشل إرسال الرسالة');
      }
    });
  }

}

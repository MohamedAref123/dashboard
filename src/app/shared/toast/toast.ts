import { Component, inject, OnInit } from '@angular/core';
import { ToastService } from 'src/services/toast';


@Component({
  selector: 'app-toast',
  imports: [],
  templateUrl: './toast.html',
  styleUrl: './toast.scss'
})
export class Toast implements OnInit {

  message: string | null = null;
  type: string = 'info';
  isVisible = false;



  toastService: ToastService = inject(ToastService);

  ngOnInit() {
    this.toastService.toastState.subscribe(toast => {
      this.message = toast.message;
      this.type = toast.type;
      this.isVisible = true;

      setTimeout(() => this.isVisible = false, 3000); // auto hide
    });
  }

}

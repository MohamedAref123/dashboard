import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Loaderservice } from 'src/services/loaderservice';

@Component({
  selector: 'app-loader',
  imports: [CommonModule],
  templateUrl: './loader.html',
  styleUrl: './loader.scss'
})
export class Loader {
private loaderService = inject(Loaderservice);
  isLoading$ = this.loaderService.loading$;
}

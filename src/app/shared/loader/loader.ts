import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, inject } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Loaderservice } from 'src/services/loaderservice';

@Component({
  selector: 'app-loader',
  imports: [CommonModule, TranslateModule],
  templateUrl: './loader.html',
  styleUrl: './loader.scss'
})
export class Loader implements AfterViewInit {
  private loaderService = inject(Loaderservice);
  translate = inject(TranslateService);
  isLoading$ = this.loaderService.loading$;

  cdr = inject(ChangeDetectorRef);
  ngAfterViewInit() {
    this.cdr.detectChanges();
  }
}

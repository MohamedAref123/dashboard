// Angular import
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

// third party import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { LoginService } from 'src/services/login.service';

@Component({
  selector: 'app-nav-right',
  imports: [RouterModule, SharedModule, NgbDropdownModule],
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss']
})
export class NavRightComponent {

  loginService = inject(LoginService);
  private router = inject(Router);
  currentLang = 'en';
  translate = inject(TranslateService)
  constructor() {
    this.currentLang = this.translate.currentLang || 'en';
    this.translate.onLangChange.subscribe((event) => {
      this.currentLang = event.lang;
    });

    this.translate.addLangs(['en', 'ar']);
    this.translate.setDefaultLang('en');
    this.translate.use('en');
    const lang = localStorage.getItem('lang') || 'en';
    this.changeLang(lang);
  }


  changeLang(lang: string) {
    this.translate.use(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('lang', lang);
  }
  switchLang(lang: string) {
    this.translate.use(lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }

  logout(event) {
    event.preventDefault();
    this.loginService.logout();
    this.router.navigate(['/login']);
  }
}

// Angular import
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { userResponse } from 'src/app/Models/Doctor/userResponse/userResponse';

// third party import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { DoctorService } from 'src/services/doctor.service';
import { LoginService } from 'src/services/login.service';

@Component({
  selector: 'app-nav-right',
  imports: [RouterModule, SharedModule, NgbDropdownModule],
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss']
})
export class NavRightComponent implements OnInit {

  profileImageUrl: string | null = null;
  doctorService = inject(DoctorService);
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

  ngOnInit(): void {

    this.doctorService.getuser('EN').subscribe((res: userResponse) => {

      console.log('Loaded user profile:', res);

      this.profileImageUrl = this.getImageUrl(res.image) || localStorage.getItem('profile_image');

    });
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

  getImageUrl(path: string): string {
    if (!path) return '';
    // لو السيرفر بيرجع فقط اسم الملف أو المسار النسبي، أضف الدومين الأساسي
    if (path.startsWith('http')) {
      return path; // الصورة فيها رابط كامل
    }
    return `http://attachments.hgtechnologygroup.net/${path}`;
  }



  logout(event) {
    event.preventDefault();
    this.loginService.logout();
    this.router.navigate(['/login']);
  }
}

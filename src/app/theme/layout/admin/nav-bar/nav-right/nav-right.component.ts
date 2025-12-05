// Angular import
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { jwtDecode } from 'jwt-decode';
import { userResponse } from 'src/app/Models/Doctor/userResponse/userResponse';
import { NotificationItem, NotificationPagedResponse } from 'src/app/Models/Responses/NotificationResponse';

// third party import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { DoctorService } from 'src/services/doctor.service';
import { LoginService } from 'src/services/login.service';

import { JwtPayload } from 'src/app/Models/shared/SharedClasses';
import { NotificationRequest } from 'src/app/Models/Requests/NotificationRequest';
import { NotificationService } from 'src/services/notification.service';
import { formatDate } from '@angular/common';

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

  notifications: NotificationItem[] = [];
  doctorId!: string;
  filterType: 'all' | 'new' | 'unread' = 'all';
  unSeenRecords: number = 0;

  notificationService = inject(NotificationService);

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

    this.setDoctorIdFromToken();
    this.loadNotifications();


  }

  private setDoctorIdFromToken() {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    const decoded = jwtDecode<JwtPayload>(token);
    this.doctorId = decoded.LoggedId;
  }

  loadNotifications() {
    const payload: NotificationRequest = {
      isSeen: null,
      pageIndex: 0,
      pageSize: 10,
      loggedId: this.doctorId
    };

    this.notificationService.getNotifications(payload).subscribe((res: NotificationPagedResponse) => {
      this.unSeenRecords = res.unSeenRecords; // عدد الإشعارات غير المقروءة
      this.notifications = res.items.map(n => ({
        ...n,
        title: n.type,
        message: n.text,
        createdDate: n.createdDate,
        isSeen: n.isSeen,
        displayTime: formatDate(n.createdDate, 'medium', 'en-US')
      }));
    });




  }


  filteredNotifications() {
    if (this.filterType === 'all') return this.notifications;

    return this.notifications;
  }

  markAllAsRead() {
    this.notifications = this.notifications.map(n => ({ ...n, isNew: false, isUnread: false }));
    // يمكنك هنا استدعاء API لتحديث حالة الإشعارات في السيرفر
  }

  openNotification(notification: NotificationItem) {
    console.log('Notification clicked:', notification);

    // لو الإشعار مش متقراه، علمه كمقروء
    if (!notification.isSeen) {
      notification.isSeen = true;
    }


  }

  getNewNotificationsCount(): number {
    return this.notifications?.filter(n => !n.isSeen).length ?? 0;
  }

  hasNewNotifications(): boolean {
    return this.getNewNotificationsCount() > 0;
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

import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DoctorSpecialistResponse } from 'src/app/Models/Responses/DoctorSpecialistResponses';
import { GetPatientHistoryResponse, PatientHistoryItem } from 'src/app/Models/Responses/getHistoryResponse';
import { environment } from 'src/environments/environment';

import { PatientService } from 'src/services/patient.service';
import { ToastService } from 'src/services/ToastService';

@Component({
  selector: 'app-search-in-patients.component',
  imports: [MatSelectModule, TranslateModule, ReactiveFormsModule, CommonModule, MatIconModule, NgbDropdownModule, CdkTableModule, FormsModule],
  templateUrl: './search-in-patients.component.html',
  styleUrl: './search-in-patients.component.scss'
})
export class SearchInPatientsComponent implements OnInit, AfterViewInit {

  @ViewChild('scrollAnchor', { static: false }) scrollAnchor!: ElementRef;

  router = inject(Router)
  patientservice = inject(PatientService);
  toast = inject(ToastService);
  specialists: DoctorSpecialistResponse[] = [];
  patientId: string | null = null;
  fb = inject(FormBuilder);
  searchForm!: FormGroup;
  previewImage: string = '';
  scale = 1;
  @ViewChild('zoomImg') zoomImg!: ElementRef<HTMLImageElement>;
  private observer!: IntersectionObserver;
  isViewerOpen = false;
  isMinimized = false;
  currentIndex = 0;
  currentImage = '';
  allImages: string[] = [];

  patientHistory: GetPatientHistoryResponse = {
    pageSize: 0,
    pageIndex: 0,
    totalRecords: 0,
    items: [],
    patientName: '',
    chronicDiseases: '',
    medicines: '',
    surgeries: '',
    bloodType: '',
    birthday: ''
  };

  pageSize = 5;
  pageIndex = 0;
  loadingMore = false;

  currentLang: string = 'ar';
  translate = inject(TranslateService)




  ngOnInit(): void {
    this.currentLang = this.translate.currentLang || 'ar';

    this.translate.onLangChange.subscribe(lang => {
      this.currentLang = lang.lang;
    });

    this.searchForm = this.fb.group({
      phone: [
        '',
        [
          Validators.required,
          Validators.pattern(/^0\d{10}$/) // رقم الهاتف يبدأ بصفر وطوله 10-15 رقم
        ]
      ]
    });
  }


  loadPatientHistory(): void {
    if (!this.hasSearched) return; // 🔥 مهم

    if (this.loadingMore) return;

    if (this.patientHistory.totalRecords <= this.pageSize * this.pageIndex) {
      console.log('NO MORE DATA');
      return;
    }

    this.loadingMore = true;

    this.patientservice
      .getpatientHistoryByphone(this.currentPhone, this.pageIndex, this.pageSize, this.patientId)
      .subscribe({
        next: (res) => {
          console.log('LOAD MORE');

          this.patientHistory.items.push(...res.items);
          this.patientId = res.items[0]?.patientId || this.patientId; // تحديث patientId لو كان null

          this.pageIndex++;
          this.loadingMore = false;
        },
        error: () => {
          this.loadingMore = false;
        }
      });
  }



  ngAfterViewInit() {
    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !this.loadingMore) {
        this.loadPatientHistory();
      }
    });
  }



  get phone() {
    return this.searchForm.get('phone');
  }
  currentPhone: string = '';
  hasSearched = false;


  searchByPhone(): void {
    if (this.searchForm.invalid) {
      this.phone?.markAsTouched();
      return;
    }

    const phoneValue = this.phone?.value;

    this.currentPhone = phoneValue;
    this.hasSearched = true;


    this.pageIndex = 0;
    this.patientId = null;

    this.patientHistory = {
      pageSize: this.pageSize,
      pageIndex: 0,
      totalRecords: 0,
      items: [],
      patientName: '',
      chronicDiseases: '',
      medicines: '',
      surgeries: '',
      bloodType: '',
      birthday: ''
    };

    console.log('SEARCH START');

    this.patientservice
      .getpatientHistoryByphone(this.currentPhone, this.pageIndex, this.pageSize, this.patientId)
      .subscribe({
        next: (res) => {
          console.log('FIRST PAGE:', res);

          this.patientHistory.items = res.items || [];
          this.patientHistory.totalRecords = res.totalRecords;
          this.patientHistory.patientName = res.patientName;
          this.patientHistory.bloodType = res.bloodType;
          this.patientHistory.chronicDiseases = res.chronicDiseases;
          this.patientHistory.medicines = res.medicines;
          this.patientHistory.surgeries = res.surgeries;
          this.patientHistory.birthday = res.birthday;
          this.patientId = res.items[0]?.patientId || null; // تحديث patientId لو كان null
          this.pageIndex++; // 🔥 مهم

          // ✅ تشغيل observer بعد ما الداتا تظهر
          setTimeout(() => {
            if (this.scrollAnchor) {
              this.observer.observe(this.scrollAnchor.nativeElement);
            }
          }, 300);


        },
        error: (err) => {
          console.error(err);

        }
      });
  }
  gotocreatehistory() {
    this.router.navigate(['/patientHistory', this.patientId])
  }
  normalizePaths(paths: string | string[] | null | undefined): string[] {
    if (!paths) return [];

    const base = environment.baseAttatchementUrl ?? '';
    const baseUrl = base.endsWith('/') ? base + 'PatientHistories/' : base + '/PatientHistories/';

    const pathArray: string[] = Array.isArray(paths) ? paths : String(paths).split(',');

    return pathArray
      .map((p) => String(p || '').trim())
      .filter((p) => p.length > 0)
      .map((p) => this.fixPath(p, baseUrl));
  }

  fixPath(path: string, baseUrl: string): string {
    if (!path) return '';

    let p = path.trim().replace(/\\/g, '/');
    p = p.replace(/^\/+/, ''); // إزالة slash زائد في البداية

    // لو المسار فيه "PatientHistories/" بالفعل، ما نضيفش baseUrl
    if (/^PatientHistories\//i.test(p)) {
      return `${environment.baseAttatchementUrl}${p}`.replace(/([^:]\/)\/+/g, '$1');
    }

    return (baseUrl + p).replace(/([^:]\/)\/+/g, '$1');
  }

  get patientAge(): number | null {
    if (!this.patientHistory?.birthday) return null;

    const birthDate = new Date(this.patientHistory.birthday);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--; // لم يمر عيد الميلاد لهذا العام بعد
    }

    return age;
  }

  getImageUrl(path: string): string {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${environment.baseAttatchementUrl}PatientHistories${path}?t=${Date.now()}`;
  }

  imagesList: string[] = [];

  // zoom
  minScale = 1;
  maxScale = 5;

  // pan
  posX = 0;
  posY = 0;
  isDragging = false;
  startX = 0;
  startY = 0;

  // touch
  touchStartDist = 0;
  touchStartScale = 1;

  onWheel(event: WheelEvent) {
    event.preventDefault();
    const delta = Math.sign(event.deltaY);
    this.scale += delta < 0 ? 0.1 : -0.1;
    this.scale = Math.max(this.minScale, Math.min(this.scale, this.maxScale));
  }

  // Drag mouse
  startDrag(event: MouseEvent) {
    this.isDragging = true;
    this.startX = event.clientX - this.posX;
    this.startY = event.clientY - this.posY;
  }

  onDrag(event: MouseEvent) {
    if (!this.isDragging || this.scale <= 1) return;
    this.posX = event.clientX - this.startX;
    this.posY = event.clientY - this.startY;
  }

  endDrag() {
    this.isDragging = false;
  }

  // Touch for pinch zoom
  startTouch(event: TouchEvent) {
    if (event.touches.length === 2) {
      const dx = event.touches[0].clientX - event.touches[1].clientX;
      const dy = event.touches[0].clientY - event.touches[1].clientY;
      this.touchStartDist = Math.hypot(dx, dy);
      this.touchStartScale = this.scale;
    }
  }

  onTouchMove(event: TouchEvent) {
    if (event.touches.length === 2) {
      const dx = event.touches[0].clientX - event.touches[1].clientX;
      const dy = event.touches[0].clientY - event.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      this.scale = this.touchStartScale * (dist / this.touchStartDist);
      this.scale = Math.max(this.minScale, Math.min(this.scale, this.maxScale));
    }
  }

  endTouch() { }

  // reset when opening new image
  openPreview(img: string | null, item: PatientHistoryItem) {
    const list = this.normalizePaths(item.paths || []);
    if (!list || list.length === 0) return;

    this.imagesList = list;
    this.currentIndex = img ? list.indexOf(img) : 0;
    this.currentImage = this.imagesList[this.currentIndex];

    this.scale = 1;
    this.posX = 0;
    this.posY = 0;
    this.isViewerOpen = true;
  }

  closeViewer() {
    this.isViewerOpen = false;
    this.isMinimized = false;
  }

  minimize() {
    this.isViewerOpen = false;
    this.isMinimized = true;
  }

  restore() {
    this.isViewerOpen = true;
    this.isMinimized = false;
  }

  nextImage() {
    this.currentIndex = (this.currentIndex + 1) % this.imagesList.length;
    this.currentImage = this.imagesList[this.currentIndex];
  }
  prevImage() {
    this.currentIndex = (this.currentIndex - 1 + this.imagesList.length) % this.imagesList.length;
    this.currentImage = this.imagesList[this.currentIndex];
  }
}

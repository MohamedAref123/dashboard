import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatOption, MatSelectModule } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { DoctorSpecialistResponse } from 'src/app/Models/Responses/DoctorSpecialistResponses';
import { GetPatientHistoryResponse, PatientHistoryItem } from 'src/app/Models/Responses/getHistoryResponse';
import { environment } from 'src/environments/environment';

import { DoctorSpecialistService } from 'src/services/DoctorSpecialistService';
import { PatientService } from 'src/services/patient.service';
import { CdkTableModule } from "@angular/cdk/table";


import { FormsModule } from "@angular/forms";
import { ToastService } from 'src/services/ToastService';

@Component({
  selector: 'app-view-patient-history-component',
  imports: [MatOption, MatSelectModule, TranslateModule, CommonModule, MatIconModule, NgbDropdownModule, CdkTableModule, FormsModule],
  templateUrl: './view-patient-history-component.html',
  styleUrl: './view-patient-history-component.scss'
})
export class ViewPatientHistoryComponent implements OnInit {

  route = inject(ActivatedRoute);
  doctorSpecialistService = inject(DoctorSpecialistService);
  patientservice = inject(PatientService);
  toast = inject(ToastService)
  specialists: DoctorSpecialistResponse[] = [];
  patientId: string;
  selectedSpecialistId: string = '';


  previewImage: string = '';
  scale = 1;
  @ViewChild('zoomImg') zoomImg!: ElementRef<HTMLImageElement>;

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
    birthday: '',

  };


  pageSize = 10;
  pageIndex = 0;
  loadingMore = false;



  ngOnInit(): void {
    this.patientId = this.route.snapshot.paramMap.get('patientId');
    this.loadSpecialists();

    this.loadPatientBasicInfo();
  }


  loadPatientBasicInfo(): void {
    this.patientservice.getPatientHistory(this.patientId, null, 0, 10)
      .subscribe({
        next: (res) => {
          // هذه الحقول العامة
          this.patientHistory.patientName = res.patientName;
          this.patientHistory.bloodType = res.bloodType;
          this.patientHistory.chronicDiseases = res.chronicDiseases;
          this.patientHistory.medicines = res.medicines;
          this.patientHistory.surgeries = res.surgeries;
          this.patientHistory.birthday = res.birthday;
          // إذا أردت يمكنك أيضاً عرض السجلات الأولى بدون تخصص
          this.patientHistory.items = res.items || [];
          this.patientHistory.totalRecords = res.totalRecords;
        },
        error: (err) => console.error('Failed to load patient info:', err)
      });
  }

  loadSpecialists(): void {
    this.doctorSpecialistService.GetAll().subscribe({
      next: (data) => this.specialists = data,
      error: (err) => console.error('Failed to load specialists:', err)
    });
  }

  onSpecialistSelected(specialistId: string): void {
    this.selectedSpecialistId = specialistId;
    this.pageIndex = 0;
    this.patientHistory.items = []; // إعادة تعيين السجلات عند تغيير الـ specialist
    this.loadPatientHistory();
  }

  loadPatientHistory(): void {
    if (!this.selectedSpecialistId || this.loadingMore) return;

    this.loadingMore = true;

    this.patientservice.getPatientHistory(this.patientId, this.selectedSpecialistId, this.pageIndex, this.pageSize, 'en')
      .subscribe({
        next: (res) => {
          //console.log('Loaded patient history:', res);

          this.patientHistory.items.push(...res.items);
          this.patientHistory.totalRecords = res.totalRecords;
          this.patientHistory.patientName = res.patientName;
          this.patientHistory.bloodType = res.bloodType;
          this.patientHistory.chronicDiseases = res.chronicDiseases;
          this.patientHistory.medicines = res.medicines;
          this.patientHistory.surgeries = res.surgeries;
          this.patientHistory.birthday = res.birthday;

          this.pageIndex++; // الصفحة التالية
          this.loadingMore = false;
        },
        error: (err) => {
          console.error('Failed to load patient history:', err);
          this.loadingMore = false;
        }
      });
  }


  normalizePaths(paths: string | string[] | null | undefined): string[] {
    if (!paths) return [];

    const base = environment.baseAttatchementUrl ?? '';
    const baseUrl = base.endsWith('/') ? base + 'PatientHistories/' : base + '/PatientHistories/';

    const pathArray: string[] = Array.isArray(paths) ? paths : String(paths).split(',');

    return pathArray
      .map(p => String(p || '').trim())
      .filter(p => p.length > 0)
      .map(p => this.fixPath(p, baseUrl));
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

  endDrag() { this.isDragging = false; }

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
    this.currentIndex =
      (this.currentIndex - 1 + this.imagesList.length) % this.imagesList.length;
    this.currentImage = this.imagesList[this.currentIndex];
  }


}

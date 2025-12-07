import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatOption, MatSelectModule } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { jwtDecode } from 'jwt-decode';
import { DoctorSpecialistResponse } from 'src/app/Models/Responses/DoctorSpecialistResponses';
import { JwtPayload } from 'src/app/Models/shared/SharedClasses';
import { DoctorService } from 'src/services/doctor.service';
import { DoctorSpecialistService } from 'src/services/DoctorSpecialistService';
import { PatientService } from 'src/services/patient.service';
import { ToastService } from 'src/services/ToastService';

@Component({
  selector: 'app-patient-history-component',
  imports: [FormsModule, MatOption, MatSelectModule, TranslateModule, CommonModule, ReactiveFormsModule],
  templateUrl: './patient-history-component.html',
  styleUrl: './patient-history-component.scss'
})
export class PatientHistoryComponent implements OnInit {
  route = inject(ActivatedRoute)
  doctorservice = inject(DoctorService)
  patientservice = inject(PatientService)
  doctorSpecialistService = inject(DoctorSpecialistService)
  patientHistory: FormGroup;
  fb = inject(FormBuilder)
  toast = inject(ToastService)
  baseAttatchementUrl = 'http://attachments.hgtechnologygroup.net/'; // من environment
  specialists: DoctorSpecialistResponse[] = [];
  doctorId: string
  patientId: string;
  specialistId: string;
  diagnosis = '';
  notes = '';
  files: File[] = [];
  currentLang: string = 'ar';
  translate = inject(TranslateService)

  ngOnInit(): void {

    this.currentLang = this.translate.currentLang || 'ar';

    this.translate.onLangChange.subscribe(lang => {
      this.currentLang = lang.lang;
    });

    this.patientHistory = this.fb.group({
      doctorSpecialistId: [null],
      diagnosis: [''],
      notes: [''],
      images: [[]]
    });
    this.patientId = this.route.snapshot.paramMap.get('patientId');

    if (!this.doctorId) {
      const decoded = jwtDecode<JwtPayload>(this.getToken());
      this.doctorId = decoded.LoggedId;


    }


    this.loadSpecialists();
  }


  loadSpecialists(): void {
    this.doctorSpecialistService.GetAll().subscribe({
      next: (data) => {
        this.specialists = data;
      },
      error: (err) => console.error('Failed to load specialists:', err)
    });
  }



  getImageUrl(path: string): string {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${this.baseAttatchementUrl}${path}?t=${Date.now()}`;
  }


  imagePreviews: string[] = []; // مصفوفة روابط preview للعرض

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    for (let i = 0; i < input.files.length; i++) {
      const file = input.files[i];
      this.files.push(file);
      this.imagePreviews.push(URL.createObjectURL(file)); // preview
    }
  }




  createHistory() {


    this.patientservice.createPatientHistoryWithImages(
      this.patientId,
      this.doctorId,
      this.patientHistory.value.doctorSpecialistId,
      this.patientHistory.value.diagnosis,
      this.patientHistory.value.notes,
      'en',
      this.files
    ).subscribe({
      next: res => { this.toast.success("history created succesfully"); console.log(res); this.patientHistory.reset() },
      error: err => console.error('❌ Error', err)
    });
  }


  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    for (let i = 0; i < input.files.length; i++) {
      const file = input.files[i];
      this.files.push(file);
      this.imagePreviews.push(URL.createObjectURL(file)); // preview
    }
  }

  removeFile(index: number) {
    this.files.splice(index, 1);
    this.imagePreviews.splice(index, 1);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

}

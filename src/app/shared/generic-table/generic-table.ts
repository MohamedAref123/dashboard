import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

export interface TableHeader {
  key: string;
  label: string;
}
@Component({
  selector: 'app-generic-table',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, CommonModule, MatIconModule, TranslateModule, MatButtonModule, MatMenuModule],
  templateUrl: './generic-table.html',
  styleUrl: './generic-table.scss'
})
export class GenericTable<T> implements OnChanges {
  //@Input() _headers:string[]=[];
  // Example mapping
  @Input() _headers: TableHeader[] = [];

  @Input() _items: T[] = []; // This should be more specific based on your data structure

  @Input() _actions: TableAction[] = [];

  @Input() totalRecords = 0;
  @Input() pageSize = 10;
  @Input() pageIndex = 0;
  @Output() pageChange = new EventEmitter<PageEvent>();

  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<T>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private translate = inject(TranslateService)
  getTranslatedValue(key: string | undefined, value: string | undefined) {
    // إذا لم يوجد key أو value
    if (!key || value === undefined || value === null) {
      console.warn('GenericTable: key or value is missing', { key, value });
      return value ?? '';
    }

    const val = value.toString();

    // حالات خاصة للـ status أو day
    if (key.toLowerCase().includes('status')) {
      return this.translate.instant('STATUS.' + val.toUpperCase());
    }
    if (key.toLowerCase().includes('day')) {
      return this.translate.instant('DAYS.' + val.toUpperCase());
    }

    // الترجمة العامة
    return this.translate.instant(val);
  }

  constructor() {
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['_items']) {
      this.dataSource.data = this._items; // <-- refresh datasource
    }
    if (changes['_headers'] || changes['_actions']) {
      this.displayedColumns = this._headers.map((h) => h.key);
    }
    if (changes['_actions'] && this._actions.length > 0) {
      this.displayedColumns = [...this.displayedColumns, 'actions']; // 👈 نضيف عمود للأزرار
    }
  }

  createStars(rating: number): number[] {
    if (!rating || rating < 1) return [];
    return Array.from({ length: rating }, (_, i) => i + 1);
  }

  getColumnValueAsNumber(row: number, key: string): number {
    const val = row[key];
    return val != null ? +val : 0;
  }



  onPageChange(event: PageEvent) {
    this.pageChange.emit(event);
  }

  onActionClick(row: T, action: string) {
    // console.log("Row:", row, "Action:", action);
    // ممكن تعمل Output EventEmitter لو عايز تبعته للـ Parent
    this.actionClicked.emit({ row, action });
  }

  @Output() actionClicked = new EventEmitter<{ row: T; action: string }>();
}

export interface TableAction {
  icon?: string; // اسم الايقونة (اختياري)
  label: string; // اسم الزر
  color?: string; // لون الزر
  action: string; // key يميز الزر (delete / edit .. إلخ)
}

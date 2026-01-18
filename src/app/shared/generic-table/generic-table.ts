import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

export interface TableHeader {
  key: string;
  label: string;
}
@Component({
  selector: 'app-generic-table',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, CommonModule, MatIconModule, TranslateModule, MatButtonModule, MatMenuModule, NgIf],
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

  constructor() {
    this.translate.addLangs(['en', 'ar']);

    const lang = localStorage.getItem('lang') || 'en';
    this.translate.use(lang);
    this.updatePaginatorLabels(lang);

    // 👈 يسمع أي تغيير لغة
    this.translate.onLangChange.subscribe(event => {
      this.updatePaginatorLabels(event.lang);
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


  getCategoryKey(category: number): string {
    switch (category) {
      case 0: return 'PAYROLL.TABLE.CATEGORY.EXAMINATION';
      case 1: return 'PAYROLL.TABLE.CATEGORY.CONSULTATION';
      case 2: return 'PAYROLL.TABLE.CATEGORY.OPERATION';
      default: return 'PAYROLL.TABLE.CATEGORY.UNKNOWN';
    }
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

  paginatorIntl = inject(MatPaginatorIntl);

  updatePaginatorLabels(lang: string) {
    if (lang === 'ar') {
      this.paginatorIntl.itemsPerPageLabel = 'عدد العناصر في الصفحة';
      this.paginatorIntl.nextPageLabel = 'الصفحة التالية';
      this.paginatorIntl.previousPageLabel = 'الصفحة السابقة';
      this.paginatorIntl.firstPageLabel = 'الصفحة الأولى';
      this.paginatorIntl.lastPageLabel = 'الصفحة الأخيرة';

      this.paginatorIntl.getRangeLabel = (page, pageSize, length) => {
        if (length === 0 || pageSize === 0) {
          return `0 من ${length}`;
        }
        const startIndex = page * pageSize;
        const endIndex = Math.min(startIndex + pageSize, length);
        return `${startIndex + 1} – ${endIndex} من ${length}`;
      };

    } else {
      this.paginatorIntl.itemsPerPageLabel = 'Items per page';
      this.paginatorIntl.nextPageLabel = 'Next page';
      this.paginatorIntl.previousPageLabel = 'Previous page';
      this.paginatorIntl.firstPageLabel = 'First page';
      this.paginatorIntl.lastPageLabel = 'Last page';

      this.paginatorIntl.getRangeLabel = (page, pageSize, length) => {
        if (length === 0 || pageSize === 0) {
          return `0 of ${length}`;
        }
        const startIndex = page * pageSize;
        const endIndex = Math.min(startIndex + pageSize, length);
        return `${startIndex + 1} – ${endIndex} of ${length}`;
      };
    }

    // 👈 مهم جدًا
    this.paginatorIntl.changes.next();
  }

}

export interface TableAction {
  icon?: string; // اسم الايقونة (اختياري)
  label: string; // اسم الزر
  color?: string; // لون الزر
  action: string; // key يميز الزر (delete / edit .. إلخ)
}

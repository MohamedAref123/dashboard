import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

export interface TableHeader {
  key: string;
  label: string;
}
@Component({
  selector: 'app-generic-table',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, CommonModule, MatIconModule, MatButtonModule, MatMenuModule],
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

// Angular import
import { Component, OnInit, output, inject } from '@angular/core';
import { Location } from '@angular/common';
import { RouterModule } from '@angular/router';

//theme version
import { environment } from 'src/environments/environment';

// project import
import { NavigationItem, NavigationItems } from '../navigation';

import { NavCollapseComponent } from './nav-collapse/nav-collapse.component';
import { NavGroupComponent } from './nav-group/nav-group.component';
import { NavItemComponent } from './nav-item/nav-item.component';

// NgScrollbarModule
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-nav-content',
  imports: [RouterModule, NavCollapseComponent, NavGroupComponent, NavItemComponent, SharedModule, TranslateModule],
  templateUrl: './nav-content.component.html',
  styleUrl: './nav-content.component.scss'
})
export class NavContentComponent implements OnInit {
  private location = inject(Location);
  private auth = inject(AuthService);

  // public props
  NavCollapsedMob = output();
  SubmenuCollapse = output();

  // version
  title = 'Demo application for version numbering';
  currentApplicationVersion = environment.appVersion;

  navigations!: NavigationItem[];
  windowWidth: number;

  // Constructor
  constructor() {
    this.navigations = this.filterMenu(NavigationItems);

    this.windowWidth = window.innerWidth;
  }

  // Life cycle events
  ngOnInit() {
    if (this.windowWidth < 1025) {
      setTimeout(() => {
        (document.querySelector('.coded-navbar') as HTMLDivElement).classList.add('menupos-static');
      }, 500);
    }
  }

  filterMenu(items: NavigationItem[]): NavigationItem[] {
    return items
      .map(item => ({ ...item }))
      .filter(item => {
        // لو عنده role و checked=false → اختفاء
        if (item.role && !this.auth.hasAnyPermission(item.role)) {
          return false;
        }

        // فلترة الأبناء recursively
        if (item.children) {
          item.children = this.filterMenu(item.children);
          return item.children.length > 0; // لو مفيش أبناء، اختفي الاب
        }

        return true; // checked=true → تظهر
      });
  }



  fireOutClick() {
    let current_url = this.location.path();
    // eslint-disable-next-line
    // @ts-ignore
    if (this.location['_baseHref']) {
      // eslint-disable-next-line
      // @ts-ignore
      current_url = this.location['_baseHref'] + this.location.path();
    }
    const link = "a.nav-link[ href='" + current_url + "' ]";
    const ele = document.querySelector(link);
    if (ele !== null && ele !== undefined) {
      const parent = ele.parentElement;
      const up_parent = parent?.parentElement?.parentElement;
      const last_parent = up_parent?.parentElement;
      if (parent?.classList.contains('coded-hasmenu')) {
        parent.classList.add('coded-trigger');
        parent.classList.add('active');
      } else if (up_parent?.classList.contains('coded-hasmenu')) {
        up_parent.classList.add('coded-trigger');
        up_parent.classList.add('active');
      } else if (last_parent?.classList.contains('coded-hasmenu')) {
        last_parent.classList.add('coded-trigger');
        last_parent.classList.add('active');
      }
    }
  }
}

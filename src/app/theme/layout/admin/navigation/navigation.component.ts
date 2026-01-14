// Angular import
import { Component, OnInit, output } from '@angular/core';
import { RouterModule } from '@angular/router';

// project import

import { NavContentComponent } from './nav-content/nav-content.component';
import { TranslateModule } from '@ngx-translate/core';
import { NavigationItems, NavigationItem } from './navigation';

import { inject } from '@angular/core';
import { AuthService } from 'src/services/auth.service';


@Component({
  selector: 'app-navigation',
  imports: [NavContentComponent, RouterModule, TranslateModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent implements OnInit {
  // public props
  NavCollapsedMob = output();
  SubmenuCollapse = output();
  navCollapsedMob = false;
  windowWidth = window.innerWidth;
  themeMode!: string;

  private auth = inject(AuthService);
  menuItems: NavigationItem[] = [];
  ngOnInit() {
    this.menuItems = this.filterMenu(NavigationItems);
  }


  filterMenu(items: NavigationItem[]): NavigationItem[] {
    return items
      .map(item => ({ ...item }))
      .filter(item => {
        if (item.role && !this.auth.hasAnyPermission(item.role)) {
          return false; // 👈 checked = false ➜ تختفي
        }

        if (item.children) {
          item.children = this.filterMenu(item.children);
          return item.children.length > 0;
        }

        return true; // 👈 checked = true ➜ تظهر
      });
  }


  // public method
  navCollapseMob() {
    if (this.windowWidth < 1025) {
      this.NavCollapsedMob.emit();
    }
  }

  navSubmenuCollapse() {
    document.querySelector('app-navigation.coded-navbar')?.classList.add('coded-trigger');
  }
}

// Angular import
import { Component, output } from '@angular/core';
import { RouterModule } from '@angular/router';

// project import

import { NavContentComponent } from './nav-content/nav-content.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-navigation',
  imports: [NavContentComponent, RouterModule, TranslateModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent {
  // public props
  NavCollapsedMob = output();
  SubmenuCollapse = output();
  navCollapsedMob = false;
  windowWidth = window.innerWidth;
  themeMode!: string;

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

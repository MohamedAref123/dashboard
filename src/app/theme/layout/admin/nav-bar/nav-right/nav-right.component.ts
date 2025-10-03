// Angular import
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

// third party import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { LoginService } from 'src/services/login.service';

@Component({
  selector: 'app-nav-right',
  imports: [RouterModule, SharedModule],
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss']
})
export class NavRightComponent {

  loginService = inject(LoginService);
  private router = inject(Router);
  
  logout(event)
  {
    event.preventDefault();
    this.loginService.logout();
    this.router.navigate(['/login']);
  }
}

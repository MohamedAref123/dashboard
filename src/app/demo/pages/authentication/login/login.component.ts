// angular import
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoginService } from 'src/services/login.service';
@Component({
  selector: 'app-login',
  imports: [RouterModule,FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private router = inject(Router);
  private loginService = inject(LoginService)
  email = '';
  password = '';

  onSubmit() {

    this.loginService.login(this.email,this.password).subscribe({
      next:(res)=>{
        this.router.navigate(['/main']);
        console.log("token is", res);
      },
      error: (err) => {
        console.error('Login failed', err);
      }
    })
  }

}

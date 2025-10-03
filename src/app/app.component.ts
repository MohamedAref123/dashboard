// Angular import
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Loader } from "./shared/loader/loader";

// project import








@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterOutlet, Loader]
})
export class AppComponent {
  title = 'Doctor Hero Management';
}

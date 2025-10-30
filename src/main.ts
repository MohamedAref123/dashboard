import { enableProdMode, importProvidersFrom } from '@angular/core';
import { environment } from './environments/environment';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppRoutingModule } from './app/app-routing.module';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { errorInterceptor } from './app/interceptors/error.interceptor';
import { loaderInterceptor } from './app/interceptors/loader.interceptor';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { CustomTranslateLoader } from './app/translate-loader';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'; // ✅ أضف هذا السطر

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideHttpClient(withInterceptors([errorInterceptor, loaderInterceptor])),
    importProvidersFrom(
      AppRoutingModule, NgbModule,
      TranslateModule.forRoot({
        defaultLanguage: 'en',
        loader: {
          provide: TranslateLoader,
          useFactory: (http: HttpClient) => new CustomTranslateLoader(http),
          deps: [HttpClient],
        },
      })
    ),
  ],
}).catch((err) => console.error(err));

import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { authInterceptor } from "./interceptors/auth.interceptor";
import { errorInterceptor } from "./interceptors/error.interceptor";
import { loaderInterceptor } from "./interceptors/loader.interceptor";

export class BerryConfig {
  static isCollapse_menu = false;
  static font_family = 'Roboto'; // Roboto, poppins, inter
}
export const appConfig = {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor,loaderInterceptor]))
  ]
};

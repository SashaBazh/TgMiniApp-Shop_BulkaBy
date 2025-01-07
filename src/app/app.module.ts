import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS, provideHttpClient, withFetch } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { routes } from './app.routes'; // Ваши маршруты
import { AuthInterceptor } from './services/auth.interceptor';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled', // восстанавливаем позицию скролла
      anchorScrolling: 'enabled',           // если используешь якоря <a href="#anchor">
      // onSameUrlNavigation: 'reload',     // иногда тоже полезно, если нужно обновлять при переходе на тот же url
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      defaultLanguage: 'ru', // Установить язык по умолчанию
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    provideHttpClient(withFetch())
  ],
  bootstrap: [], // Указан AppComponent как корневой
})
export class AppModule {}

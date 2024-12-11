import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const telegramInitData = (window as any).Telegram?.WebApp?.initData || '1';

    // Добавляем заголовки ко всем запросам
    const modifiedReq = req.clone({
      setHeaders: {
        'X-Telegram-Init-Data': telegramInitData,
        'Content-Type': 'application/json',
      },
    });

    return next.handle(modifiedReq);
  }
}

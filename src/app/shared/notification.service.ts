// src/app/shared/notification.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private _message: string | null = null;
  private _type: 'success' | 'error' | null = null;

  setMessage(message: string, type: 'success' | 'error') {
    this._message = message;
    this._type = type;
  }

  consumeMessage(): { message: string; type: 'success' | 'error' } | null {
    if (this._message && this._type) {
      const result = { message: this._message, type: this._type };
      this._message = null;
      this._type = null;
      return result;
    }
    return null;
  }
}

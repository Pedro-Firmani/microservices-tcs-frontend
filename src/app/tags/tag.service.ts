import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tag } from './tag.model'; 

export interface TagRequest {
  name: string;
  color: string;
}

@Injectable({
  providedIn: 'root'
})
export class TagService {
  private apiUrl = 'http://localhost:8083/tags';

  constructor(private http: HttpClient) { }

  // Métodos existentes...
  getAllTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(this.apiUrl);
  }

  getTagById(id: number): Observable<Tag> {
    return this.http.get<Tag>(`${this.apiUrl}/${id}`);
  }

  createTag(tag: TagRequest): Observable<Tag> {
    return this.http.post<Tag>(this.apiUrl, tag);
  }

  updateTag(id: number, tag: TagRequest): Observable<Tag> {
    return this.http.put<Tag>(`${this.apiUrl}/${id}`, tag);
  }

  deleteTag(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Novos métodos para manipulação de cores
  getDarkerColor(hex: string, percent: number): string {
    if (!hex || !/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      return '#512da8';
    }

    if (hex.length === 4) {
      hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
    }

    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);

    r = Math.max(0, Math.floor(r * (1 - percent / 100)));
    g = Math.max(0, Math.floor(g * (1 - percent / 100)));
    b = Math.max(0, Math.floor(b * (1 - percent / 100)));

    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }

  getTextColor(hex: string): string {
    if (!hex || !/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      return '#FFFFFF';
    }

    if (hex.length === 4) {
      hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
    }

    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  }
}
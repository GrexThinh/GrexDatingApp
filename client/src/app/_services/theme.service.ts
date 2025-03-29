import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private currentTheme: string = 'journal';

  constructor() {}

  setTheme(themeName: string): void {
    const existingLink: HTMLLinkElement = document.getElementById(
      'theme-link'
    ) as HTMLLinkElement;
    if (existingLink) {
      existingLink.remove();
    }

    const newLink = document.createElement('link');
    newLink.id = 'theme-link';
    newLink.rel = 'stylesheet';
    newLink.href = `https://cdn.jsdelivr.net/npm/bootswatch@5.3.3/dist/${themeName}/bootstrap.min.css`;

    document.head.appendChild(newLink);

    this.currentTheme = themeName;
    localStorage.setItem('theme', themeName);
  }

  getTheme(): string {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    return this.currentTheme;
  }
}

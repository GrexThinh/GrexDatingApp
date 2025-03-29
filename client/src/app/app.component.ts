import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './nav/nav.component';
import { AccountService } from './_services/account.service';
import { NgxSpinnerComponent } from 'ngx-spinner';
import { ThemeService } from './_services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavComponent, NgxSpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private accountService = inject(AccountService);
  private themeService = inject(ThemeService);
  title = 'Fan Booking';

  ngOnInit(): void {
    this.setCurrentUser();
    this.applySavedTheme();
  }

  setCurrentUser() {
    const userString = localStorage.getItem('user');
    if (!userString) return;
    const user = JSON.parse(userString);
    this.accountService.setCurrentUser(user);
  }

  applySavedTheme() {
    const currentTheme = this.themeService.getTheme();
    this.themeService.setTheme(currentTheme);
  }
}

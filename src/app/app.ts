import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SessionService } from './core/services/session.service';
import { Loader } from './core/components/loader/loader';
import { Notification } from './core/components/notification/notification';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Loader, Notification],
  templateUrl: './app.html'
})
export class App implements OnInit{
  private readonly sessionSvc = inject(SessionService);

  ngOnInit(): void {
    this.sessionSvc.loadSession().subscribe();
  }
}

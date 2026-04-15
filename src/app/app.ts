import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SessionService } from './core/services/session.service';
import { Loader } from './shared/components/loader/loader';
import { Notification } from './shared/components/notification/notification';

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

import { Component, OnInit } from '@angular/core';
import * as AuthActions from './store/auth/auth.actions';
import { Store } from '@ngrx/store';
import * as fromApp from './store/app.reducers';
import { AutoLogoutService } from './services/logout-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private store: Store<fromApp.AppState>,
    private autoLogoutService : AutoLogoutService ) {
  }

  ngOnInit(): void {
    this.store.dispatch(new AuthActions.CheckIfLoggedIn());
  }

  onActivate($event) {
    window.scroll(0, 0);
  }
}

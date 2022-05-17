import { HostListener, Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, Subscription } from 'rxjs';
import { EAuth } from '../enum/auth.enum';
import { AppState } from '../store/app.reducers';

@Injectable({
  providedIn: 'root',
})
export class AutoLogoutService {
  private accessToken: string;

  public getLastAction() {
    return parseInt(localStorage.getItem('lastAction'));
  }

  public setLastAction(lastAction: number) {
    localStorage.setItem('lastAction', lastAction.toString());
  }

  subscriptions: Subscription[] = [];
  ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

  static isInitCheckLastPage = false;
  static isLastpage = true;

  constructor(private router: Router, private store: Store<AppState>) {
    this.accessToken =
      JSON.parse(localStorage.getItem('usr')) &&
      JSON.parse(localStorage.getItem('usr')).accessToken;
    this.check();
    this.initListener();
    this.initInterval();
    localStorage.setItem('lastAction', Date.now().toString());

    if (!AutoLogoutService.isInitCheckLastPage) {
      AutoLogoutService.isInitCheckLastPage = true;
      this.initCheckLastPage();
    }
  }

  checkTabsOnFrame() {
    const bc = new BroadcastChannel('localhost');

    bc.onmessage = (event) => {
      console.log(event)
      if (event.data === `Am I the first?`) {
        bc.postMessage(`No you're not.`);
        console.log(`Another tab of this site just got opened`);
      }
      if (event.data === `No you're not.`) {
        console.log(`An instance of this site is already running`);
      }
    };

    bc.postMessage(`Am I the first?`);
  }

  initCheckLastPage() {
    // localStorage.setItem('openpages', Date.now().toString());

    // var onLocalStorageEvent = function (e) {
    //   if (e.key == 'openpages') {
    //     // console.log('Is last page');
    //     // Emit that you're already available.
    //     localStorage.setItem('page_available', Date.now().toString());
    //     AutoLogoutService.isLastpage = true;
    //   }
    //   if (e.key == 'page_available') {
    //     // console.log('Not last page');
    //     AutoLogoutService.isLastpage = false;
    //   }
    // };

    //window.addEventListener('storage', onLocalStorageEvent, false);

    //window.addEventListener('beforeunload', (e) => {
    //this.handleLogoutWhenCloseLastTab(e);
    //});
    //window.addEventListener('unload', (e) => {
    //this.handleLogoutWhenCloseLastTab(e);
    //});
  }

  private handleLogoutWhenCloseLastTab(e) {
    // localStorage.setItem('openpages', Date.now().toString());

    // // If is last tab, logout account
    // if (AutoLogoutService.isLastpage) {
    // console.log("Logout");
    // this.authService.logout();
    // }
    // e.preventDefault();
    // e.returnValue = false;

    let valueRemove = sessionStorage.getItem('openPages');
    if(valueRemove){
      sessionStorage.clear();
      let valueTabsOpen = localStorage.getItem('listOpenPages') && localStorage.getItem('listOpenPages').length ? JSON.parse(localStorage.getItem('listOpenPages')) : [];
      valueTabsOpen = valueTabsOpen.filter(x=>x!=valueRemove);

      if(valueTabsOpen.length){
        localStorage.setItem('listOpenPages',JSON.stringify(valueTabsOpen));
      }else{
        localStorage.clear();
      }
    }
  }

  initListener() {
    document.body.addEventListener('click', () => this.reset());
    document.body.addEventListener('mouseover', () => this.reset());
    document.body.addEventListener('mouseout', () => this.reset());
    document.body.addEventListener('keydown', () => this.reset());
    document.body.addEventListener('keyup', () => this.reset());
    document.body.addEventListener('keypress', () => this.reset());
  }

  reset() {
    this.setLastAction(Date.now());
  }

  initInterval() {
    let stringDate = Date.now().toString();
    sessionStorage.setItem('openPages',stringDate);
    let valueTabsOpen : any = localStorage.getItem('listOpenPages') && localStorage.getItem('listOpenPages').length ? JSON.parse(localStorage.getItem('listOpenPages')) : [];
    valueTabsOpen.push(stringDate);
    console.log(valueTabsOpen)
    localStorage.setItem('listOpenPages',JSON.stringify(valueTabsOpen));

    window.addEventListener('beforeunload', (e) => {
    this.handleLogoutWhenCloseLastTab(e);
    });

    window.addEventListener('unload', (e) => {
    this.handleLogoutWhenCloseLastTab(e) 
    });



    setInterval(() => {
      this.check();
    }, EAuth.CHECK_INTERVAL);
  }

  check() {
    const now = Date.now();
    const timeleft =
      this.getLastAction() + EAuth.MINUTES_UNTIL_AUTO_LOGOUT * 1 * 1000;
    const diff = timeleft - now;
    const isTimeout = diff < 0;
    if (
      isTimeout &&
      this.router.url.indexOf('/login') < 0 &&
      JSON.parse(localStorage.getItem('usr')) &&
      JSON.parse(localStorage.getItem('usr')).accessToken
    ) {
      localStorage.clear();
      this.router.navigate(['']);
      window.location.reload();
      this.unsubscribe();
    }

    // if(JSON.parse(localStorage.getItem('usr')) && JSON.parse(localStorage.getItem('usr')).accessToken && JSON.parse(localStorage.getItem('usr')).accessToken !== this.accessToken) {
    // this.accessToken = JSON.parse(localStorage.getItem('usr')).accessToken;
    // // this.unsubscribe();
    // return;
    // }

    // this.router.navigate(['./login']);
    // this.unsubscribe();
  }

  unsubscribe() {}
}

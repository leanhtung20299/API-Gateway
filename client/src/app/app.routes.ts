import { GPageNotFoundComponent } from './g-page-not-found/g-page-not-found.component';
import { Routes } from '@angular/router';

export const AppRoutes: Routes = [
  { path: '', 
    loadChildren: () => import("./home/home.module").then(m => m.HomeModule)
  },
  { path: 'not-found', 
    component: GPageNotFoundComponent, 
    data: { message: 'Page not found!' }
  },
  { path: 'account',
    loadChildren: () => import("./account/account.module").then(m => m.AccountModule)
    // loadChildren: './account/account.module#AccountModule' 
  },
  { path: 'cart',
    loadChildren: () => import("./account/account.module").then(m => m.AccountModule)
  },
  { path: 'checkout', 
     loadChildren: () => import("./checkout/checkout.module").then(m => m.CheckoutModule)
  },
  { path: 'faq', 
    loadChildren: () => import("./faq/faq.module").then(m => m.FaqModule)
  },
  { path: '**', 
   redirectTo: '/not-found' }
];


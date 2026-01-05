import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            { path: '', component: Dashboard },
            { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            { path: 'documentation', component: Documentation },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') },
            {
                path: 'company-post',
                loadChildren: () =>
                    import('./app/pages/company/company-module').then(m => m.CompanyModule)
            },
            {
                path: 'terminal',
                loadChildren: () => import('./app/pages/terminal/terminal-module').then(m => m.TerminalModule)
            },
            {
                path: 'manufacturer',
                loadChildren: () => import('./app/pages/manufacturer/manufacturer-module').then(m => m.ManufacturerModule)
            },
            {
                path: 'product',
                loadChildren: () => import('./app/pages/product/product-module').then(m => m.ProductModule)
            },
            {
                path: 'model',
                loadChildren: () => import('./app/pages/model/model-module').then(m => m.ModelModule)
            }
        ]
    },
    { path: 'landing', component: Landing },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];

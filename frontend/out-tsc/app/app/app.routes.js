import { ShellComponent } from './layout/shell/shell.component';
export const appRoutes = [
    {
        path: '',
        component: ShellComponent,
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'overview' },
            {
                path: 'overview',
                loadComponent: () => import('./features/overview/overview.page').then((m) => m.OverviewPage)
            },
            {
                path: 'live-operations',
                loadComponent: () => import('./features/live-operations/live-operations.page').then((m) => m.LiveOperationsPage)
            },
            {
                path: 'analysis',
                loadComponent: () => import('./features/analysis/analysis.page').then((m) => m.AnalysisPage)
            },
            {
                path: 'tickets',
                loadComponent: () => import('./features/tickets/tickets.page').then((m) => m.TicketsPage)
            },
            {
                path: 'strategy',
                loadComponent: () => import('./features/strategy/strategy.page').then((m) => m.StrategyPage)
            },
            {
                path: 'bankroll',
                loadComponent: () => import('./features/bankroll/bankroll.page').then((m) => m.BankrollPage)
            },
            {
                path: 'performance',
                loadComponent: () => import('./features/performance/performance.page').then((m) => m.PerformancePage)
            },
            {
                path: 'api-costs',
                loadComponent: () => import('./features/api-costs/api-costs.page').then((m) => m.ApiCostsPage)
            },
            {
                path: 'market-dictionary',
                loadComponent: () => import('./features/market-dictionary/market-dictionary.page').then((m) => m.MarketDictionaryPage)
            },
            {
                path: 'platform-agents',
                loadComponent: () => import('./features/platform-agents/platform-agents.page').then((m) => m.PlatformAgentsPage)
            },
            {
                path: 'logs-audit',
                loadComponent: () => import('./features/logs-audit/logs-audit.page').then((m) => m.LogsAuditPage)
            },
            {
                path: 'settings',
                loadComponent: () => import('./features/settings/settings.page').then((m) => m.SettingsPage)
            },
            {
                path: 'design-system',
                loadComponent: () => import('./features/design-system/design-system.page').then((m) => m.DesignSystemPage)
            }
        ]
    },
    { path: '**', redirectTo: '' }
];
//# sourceMappingURL=app.routes.js.map
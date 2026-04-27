export interface NavItem {
  path: string;
  label: string;
}

export const NAV_ITEMS: NavItem[] = [
  { path: '/overview', label: 'Overview' },
  { path: '/live-operations', label: 'Live Ops' },
  { path: '/analysis', label: 'Analysis' },
  { path: '/tickets', label: 'Tickets' },
  { path: '/strategy', label: 'Strategy' },
  { path: '/bankroll', label: 'Bankroll' },
  { path: '/performance', label: 'Performance' },
  { path: '/api-costs', label: 'API Costs' },
  { path: '/market-dictionary', label: 'Markets' },
  { path: '/platform-agents', label: 'Agents' },
  { path: '/logs-audit', label: 'Logs' }
];

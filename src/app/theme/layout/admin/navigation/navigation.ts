export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  children?: NavigationItem[];
  role?: string[];
  isMainParent?: boolean;
}

export const NavigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    title: 'HealthCare Management',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'default',
        title: 'Dashboard',
        type: 'item',
        classes: 'nav-item',
        url: '/main',
        icon: 'ti ti-home',
        breadcrumbs: false
      },
      {
        id: 'profile',
        title: 'profile',
        type: 'item',
        classes: 'nav-item',
        url: '/profile',
        icon: 'ti ti-user',
        breadcrumbs: false
      },
      {
        id: 'Addresses',
        title: 'Addresses',
        type: 'item',
        classes: 'nav-item',
        url: '/addresses',
        icon: 'ti ti-map-pin',
        breadcrumbs: false
      }
    ]
  },


];

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
    title: 'MENU.GROUP',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'default',
        title: 'MENU.DASHBOARD',
        type: 'item',
        classes: 'nav-item',
        url: '/main',
        icon: 'ti ti-home',
        breadcrumbs: false
      },
      {
        id: 'profile',
        title: 'MENU.PROFILE',
        type: 'item',
        classes: 'nav-item',
        url: '/profile',
        icon: 'ti ti-user',
        breadcrumbs: false
      },
      {
        id: 'appointment',
        title: 'MENU.APPOINTMENT',
        type: 'item',
        classes: 'nav-item',
        url: '/appointments',
        icon: 'ti ti-calendar',
        breadcrumbs: false
      },
      {
        id: 'CurrentAvailabilities',
        title: 'MENU.CURRENT_AVAILABILITIES',
        type: 'item',
        classes: 'nav-item',
        url: '/current-availabilities',
        icon: 'ti ti-calendar-time',
        breadcrumbs: false
      },
      {
        id: 'Cancel-Day',
        title: 'MENU.CANCEL_DAY',
        type: 'item',
        classes: 'nav-item',
        url: '/Cancel-Day',
        icon: 'ti ti-calendar-x',
        breadcrumbs: false
      },
      {
        id: 'Reviews',
        title: 'MENU.REVIEWS',
        type: 'item',
        classes: 'nav-item',
        url: '/reviews',
        icon: 'ti ti-message-circle',
        breadcrumbs: false
      },


    ]
  },

  // {
  //   id: 'Subuser',
  //   title: 'MENU.SUBUSER.GROUP',
  //   type: 'group',
  //   icon: 'ti ti-users',
  //   children: [
  //     {
  //       id: 'subusers',
  //       title: 'MENU.SUBUSER.GROUP',
  //       type: 'collapse',
  //       classes: 'nav-item',
  //       icon: 'ti ti-user-cog',
  //       breadcrumbs: false,
  //       children: [
  //         {
  //           id: 'sub-user',
  //           title: 'MENU.SUBUSER.USERS',
  //           type: 'item',
  //           url: '/Subuser',
  //           icon: 'ti ti-user',
  //           breadcrumbs: false
  //         }
  //       ]
  //     }
  //   ]
  // }


  {
    id: 'Subuser',
    title: 'MENU.SUBUSER.GROUP',
    type: 'group',
    icon: 'ti ti-users',
    children: [
      {
        id: 'sub-user',
        title: 'MENU.SUBUSER.USERS',
        type: 'item',
        classes: 'nav-item',
        url: '/Subuser',
        icon: 'ti ti-user',
        breadcrumbs: false
      }
    ]
  }




];


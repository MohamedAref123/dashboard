export interface NotificationItem {
  notificationId: string;
  text: string;
  type: string;
  isSeen: boolean;
  loggedId: string;
  createdDate: string;
  displayTime?: string;
}

export interface NotificationPagedResponse {
  pageSize: number;
  pageIndex: number;
  totalRecords: number;
  unSeenRecords: number;
  items: NotificationItem[];
}

export enum NotificationType {
  // reservation notification
  RESERVATION_CREATED = 'reservation_created',
  RESERVATION_READY = 'reservation_ready',
  RESERVATION_EXPIRED = 'reservation_expired',
  RESERVATION_CANCELLED = 'reservation_cancelled',
  //loan notification
  LOAN_ISSUED = 'loan_issued',
  LOAN_RETURNED = 'loan_returned',
  LOAN_OVERDUE = 'loan_overdue',
  // fine notification
  FINE_CREATED = 'fine_created',
}

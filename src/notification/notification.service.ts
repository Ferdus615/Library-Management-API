import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { NotificationType } from './enum/notificatio.enum';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async notify(
    user: User,
    type: NotificationType,
    payload: Record<string, any>,
  ) {
    const { title, message } = this.buildNotification(type, payload);

    const notification = this.notificationRepository.create({
      user,
      title,
      message,
      type,
    });

    await this.notificationRepository.save(notification);
  }

  private buildNotification(
    type: NotificationType,
    payload: Record<string, any>,
  ) {
    switch (type) {
      case NotificationType.RESERVATION_READY:
        return {
          title: 'Reservation Ready',
          message: `Your reservation for "${payload.bookTitle}" is ready for pickup.`,
        };
      case NotificationType.RESERVATION_EXPIRED:
        return {
          title: 'Reservation Expired',
          message: `Your reservation for "${payload.bookTitle}" has expired.`,
        };
      case NotificationType.LOAN_RETURNED:
        return {
          title: 'Book Returned',
          message: `You have returned "${payload.bookTitle}".`,
        };
      case NotificationType.LOAN_OVERDUE:
        return {
          title: 'Book Overdue',
          message: `The book "${payload.bookTitle}" is overdue.`,
        };
      case NotificationType.FINE_CREATED:
        return {
          title: 'Fine Issued',
          message: `A fine of $${payload.amount} has been issued for "${payload.bookTitle}".`,
        };
      default:
        return {
          title: 'Notification',
          message: 'You have a new notification.',
        };
    }
  }
}

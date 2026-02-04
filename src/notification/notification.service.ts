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
    const message = await this.buildMessage(type, payload);

    const notification = this.notificationRepository.create({
      user,
      type,
      ...message,
    });

    console.log(`Notification sent: ${notification}`);

    await this.notificationRepository.save(notification);
  }

  async buildMessage(type: NotificationType, payload: Record<string, any>) {
    switch (type) {
      case NotificationType.RESERVATION_CREATED:
        return {
          title: 'Book Reserved!',
          message: `You have requested a reservation for "${payload.bookTitle}".`,
        };

      case NotificationType.RESERVATION_READY:
        return {
          title: 'Book Ready for Pickup!',
          message: `Your reserved book "${payload.bookTitle}" is ready for pickup. Please collect it within 3 days.`,
        };

      case NotificationType.RESERVATION_EXPIRED:
        return {
          title: 'Book Reservation Expired!',
          message: `Your reservation for "${payload.bookTitle}" has expired.`,
        };

      case NotificationType.RESERVATION_CANCELLED:
        return {
          title: 'Book Reservation Cancelled!',
          message: `Your reservation for "${payload.bookTitle}" has been cancelled.`,
        };

      case NotificationType.LOAN_ISSUED:
        return {
          title: 'Book Issued!',
          message: `You have successfully issued "${payload.bookTitle}".`,
        };

      case NotificationType.LOAN_RETURNED:
        return {
          title: 'Book Returned!',
          message: `You have successfully returned "${payload.bookTitle}".`,
        };

      case NotificationType.LOAN_OVERDUE:
        return {
          title: 'Book Overdue!',
          message: `Your book "${payload.bookTitle}" is overdue.`,
        };

      case NotificationType.FINE_CREATED:
        return {
          title: 'Fine Issued!',
          message: `A fine of $${payload.amount} has been issued for your overdue book "${payload.bookTitle}". 
          Please return it as soon as possible. You will be find $10 per day`,
        };

      case NotificationType.FINE_PAID:
        return {
          title: 'Fine Paid!',
          message: `You have successfully paid the fine of $${payload.amount} for your overdue book "${payload.bookTitle}".`,
        };
    }
  }
}

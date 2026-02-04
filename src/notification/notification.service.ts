import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { NotificationType } from './enum/notificatio.enum';
import { title } from 'process';

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
    const message = this.buildMessage(type, payload);

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
      case NotificationType.RESERVATION_READY:
        return {
          title: 'Book ready for pickup',
          message: `Your reserved book "${payload.bookTitle}" is ready for pickup. Please collect it within 3 days.`,
        };

      case NotificationType.RESERVATION_EXPIRED:
        return {
          title: 'Book reservation expired.',
          message: `Your reservation for "${payload.bookTitle}" has expired.`,
        };

      case NotificationType.LOAN_RETURNED:
        return {
          title: 'Book returned',
          message: `You have successfully returned "${payload.bookTitle}".`,
        };

      case NotificationType.LOAN_OVERDUE:
        return {
          title: 'Book overdue',
          message: `Your book "${payload.bookTitle}" is overdue.`,
        };

      case NotificationType.FINE_CREATED:
        return {
          title: 'Fine Issued!',
          message: `A fine of ${payload.amount} has been issued for your overdue book "${payload.bookTitle}". 
          Please return it as soon as possible. You will be find $10 per day`,
        };
    }
  }
}

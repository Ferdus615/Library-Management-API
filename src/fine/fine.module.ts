import { Module } from '@nestjs/common';
import { FineService } from './fine.service';
import { FineController } from './fine.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Loan } from 'src/loan/entities/loan.entity';
import { Fine } from './entities/fine.entity';
import { FineCron } from './cron/fine.cron';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Loan, Fine]), NotificationModule],
  controllers: [FineController],
  providers: [FineService, FineCron],
})
export class FineModule {}

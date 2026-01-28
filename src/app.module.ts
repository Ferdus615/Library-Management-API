import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/db.config';
import { BookModule } from './book/book.module';
import { UserModule } from './user/user.module';
import { LoanModule } from './loan/loan.module';
import { FineModule } from './fine/fine.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ReservationModule } from './reservation/reservation.module';
import { CategoryModule } from './category/category.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRoot(typeOrmConfig),
    BookModule,
    UserModule,
    LoanModule,
    FineModule,
    ReservationModule,
    CategoryModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

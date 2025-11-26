import { Module } from '@nestjs/common';
import { FineService } from './fine.service';
import { FineController } from './fine.controller';

@Module({
  controllers: [FineController],
  providers: [FineService],
})
export class FineModule {}

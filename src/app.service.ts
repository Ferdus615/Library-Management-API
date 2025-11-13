import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Mama mia, worldo! Esse meee.';
  }
}

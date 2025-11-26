import { Controller } from '@nestjs/common';
import { FineService } from './fine.service';

@Controller('fine')
export class FineController {
  constructor(private readonly fineService: FineService) {}
}

import { Test, TestingModule } from '@nestjs/testing';
import { FineController } from './fine.controller';
import { FineService } from './fine.service';

describe('FineController', () => {
  let controller: FineController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FineController],
      providers: [FineService],
    }).compile();

    controller = module.get<FineController>(FineController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

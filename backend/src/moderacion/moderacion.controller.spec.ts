import { Test, TestingModule } from '@nestjs/testing';
import { ModeracionController } from './moderacion.controller';

describe('ModeracionController', () => {
  let controller: ModeracionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ModeracionController],
    }).compile();

    controller = module.get<ModeracionController>(ModeracionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

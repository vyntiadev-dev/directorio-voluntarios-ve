import { Test, TestingModule } from '@nestjs/testing';
import { ModeracionService } from './moderacion.service';

describe('ModeracionService', () => {
  let service: ModeracionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ModeracionService],
    }).compile();

    service = module.get<ModeracionService>(ModeracionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

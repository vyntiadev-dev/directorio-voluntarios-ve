import { Test, TestingModule } from '@nestjs/testing';
import { VoluntariosService } from './voluntarios.service';

describe('VoluntariosService', () => {
  let service: VoluntariosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VoluntariosService],
    }).compile();

    service = module.get<VoluntariosService>(VoluntariosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { VoluntariosController } from './voluntarios.controller';

describe('VoluntariosController', () => {
  let controller: VoluntariosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VoluntariosController],
    }).compile();

    controller = module.get<VoluntariosController>(VoluntariosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ResepController } from './resep.controller';
import { ResepService } from './resep.service';

describe('ResepController', () => {
  let controller: ResepController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResepController],
      providers: [
        { provide: ResepService, useValue: {} },
        { provide: JwtService, useValue: {} },
      ],
    }).compile();

    controller = module.get<ResepController>(ResepController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

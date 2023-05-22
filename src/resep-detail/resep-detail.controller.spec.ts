import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { LabelController } from './resep-detail.controller';
import { LabelService } from './resep-detail.service';

describe('LabelController', () => {
  let controller: LabelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LabelController],
      providers: [
        { provide: LabelService, useValue: {} },
        { provide: JwtService, useValue: {} },
      ],
    }).compile();

    controller = module.get<LabelController>(LabelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { ObatController } from './obat.controller';
import { ObatService } from './obat.service';

describe('ObatController', () => {
  let controller: ObatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ObatController],
      providers: [
        { provide: ObatService, useValue: {} },
      ],
    }).compile();

    controller = module.get<ObatController>(ObatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

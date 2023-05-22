import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { ResepDetailService } from './resep-detail.service';

describe('ResepDetailService', () => {
  let service: ResepDetailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResepDetailService,
        { provide: ConfigService, useValue: {} },
      ]
    }).compile();

    service = module.get<ResepDetailService>(ResepDetailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

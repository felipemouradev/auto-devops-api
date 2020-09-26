import { Test, TestingModule } from '@nestjs/testing';
import { ConfigMapService } from '../services/config-map.service';

describe('ConfigMapService', () => {
  let service: ConfigMapService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigMapService],
    }).compile();

    service = module.get<ConfigMapService>(ConfigMapService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

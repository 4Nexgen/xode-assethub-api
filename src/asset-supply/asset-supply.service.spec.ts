import { Test, TestingModule } from '@nestjs/testing';
import { AssetSupplyService } from './asset-supply.service';

describe('AssetSupplyService', () => {
  let service: AssetSupplyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssetSupplyService],
    }).compile();

    service = module.get<AssetSupplyService>(AssetSupplyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

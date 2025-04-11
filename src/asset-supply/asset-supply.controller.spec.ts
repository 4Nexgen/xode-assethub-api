import { Test, TestingModule } from '@nestjs/testing';
import { AssetSupplyController } from './asset-supply.controller';
import { AssetSupplyService } from './asset-supply.service';

describe('AssetSupplyController', () => {
  let controller: AssetSupplyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssetSupplyController],
      providers: [AssetSupplyService],
    }).compile();

    controller = module.get<AssetSupplyController>(AssetSupplyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Module } from '@nestjs/common';
import { AssetSupplyService } from './asset-supply.service';
import { AssetSupplyController } from './asset-supply.controller';

@Module({
  controllers: [AssetSupplyController],
  providers: [AssetSupplyService],
})
export class AssetSupplyModule {}

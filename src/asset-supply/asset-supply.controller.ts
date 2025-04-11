import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { AssetSupplyService } from './asset-supply.service';

@Controller('api')
export class AssetSupplyController {
  constructor(private readonly assetSupplyService: AssetSupplyService) {}

  @Get('total-supply/:assetId')
  async getTotalSupply(
    @Param('assetId', ParseIntPipe) assetId: number
  ) {
    const totalSupply = await this.assetSupplyService.getTotalSupply(assetId);
    return { assetId, totalSupply };
  }

  @Get('circulating-supply/:assetId')
  async getCirculatingSupply(@Param('assetId') assetId: string) {
    const circulatingSupply = await this.assetSupplyService.getCirculatingSupply(Number(assetId));
    return { assetId, circulatingSupply };
  }
}

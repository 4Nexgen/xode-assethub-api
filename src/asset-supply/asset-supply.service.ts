import { Injectable } from '@nestjs/common';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { Option } from '@polkadot/types';
import { AssetDetails } from '@polkadot/types/interfaces';
import { BN } from '@polkadot/util'; 

@Injectable()
export class AssetSupplyService {
    private api: ApiPromise;

    constructor() {
      this.init();
    }
  
    private async init() {
      const provider = new WsProvider('wss://polkadot-asset-hub-rpc.polkadot.io');
      this.api = await ApiPromise.create({ provider });
    }
  
    async getTotalSupply(assetId: number): Promise<string> {
        const asset = await this.api.query.assets.asset(assetId);
        const assetOpt = asset as unknown as Option<AssetDetails>;
    
        if (assetOpt.isNone) {
          throw new Error(`Asset ID ${assetId} not found`);
        }
    
        const { supply } = assetOpt.unwrap();
        const formattedSupply = await this.formatBigSupply(supply.toString());
        return formattedSupply;
    }

    async formatBigSupply(raw: string, decimals = 12): Promise<string> {
        const bigIntValue = BigInt(raw);
        const divisor = BigInt(10 ** decimals);
      
        const whole = bigIntValue / divisor;
        const fraction = bigIntValue % divisor;
      
        const fractionStr = (fraction * BigInt(100) / divisor).toString().padStart(2, '0'); // two decimals
      
        return `${Number(whole).toLocaleString()}.${fractionStr}`;
    }

    async getCirculatingSupply(assetId: number): Promise<string> {
        const mpcAccounts = [
            '13g6SytD4dHQ9V7VzNk46YHdETniaQn6DVmq65s4763EgkUR',
            '16Lr9GVE8FjKd4kvbXu3j5HZuYRiS3mfeHoptFhNvmKUSGK1',
            '1yCWV8sHHURgaey6Tpp8qJ6XiPANegrrgT7Z1uDWK1G1gfe',
            '14W3d5XJ4f7UQtz4C6qCNqUREnMNFtRhmSma2nLHAJQ5fJW',
        ];

        const totalSupply = await this.getTotalSupply(assetId);
        const totalSupplyStr = totalSupply.replace(/,/g, ''); 
        const cleanStr = totalSupplyStr.replace('.', ''); 

        const totalSupplyBigInt = BigInt(cleanStr);

        const entries = await this.api.query.assets.account.entries(assetId);

        let circulating = BigInt(0);
        let excluded = BigInt(0);

        for (const [key, accountInfoOpt] of entries) {
            const accountId = key.args[1].toString(); 

            const result = await this.api.query.assets.account(assetId, accountId);
            const accountInfo = result.toJSON() as { balance: string, isFrozen: boolean, reason: any, extra: any };
            
            const balanceHex = accountInfo.balance;

            if (mpcAccounts.includes(accountId)) {
                const balance = BigInt(balanceHex);
                excluded += balance;
            } else {
                const balance = BigInt(balanceHex);
                circulating += balance;
            }
        }

        const circulatingSupply = await this.formatBigSupply(circulating.toString());

        return circulatingSupply.toString(); 
    }

}

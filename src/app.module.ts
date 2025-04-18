import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiModule } from './api/api.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AssetSupplyModule } from './asset-supply/asset-supply.module';

@Module({
  imports: [
    ApiModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), // Path to your static files
    }),
    AssetSupplyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

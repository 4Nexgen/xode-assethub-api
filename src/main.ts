import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  await cryptoWaitReady();
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Xode AssetHub API')
    .setDescription(
      'The AssetHub API is now integrated with Polkadot AssetHub RPC to monitor blocks and track transactions related to MPC assets added in Polkadot AssetHub. It provides methods for creating wallet addresses, retrieving the latest block height, fetching transactions for specific blocks, checking transaction details, ensuring transaction accuracy, making transfers with offline signing, and querying address balances.',
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Custom Swagger UI options
  const options = {
    customCss: `
      .topbar-wrapper {
        background-image: url(/logo.png);
        background-repeat: no-repeat;
        background-position: left center;
        background-size: contain;
        padding-left: 100px; /* Adjust based on logo width */;
      }
      .topbar-wrapper a{
        svg{
          g{
           display: none !important;
          }
          
        }
      }
    `,
    customSiteTitle: 'Xode Blockchain API',
    customfavIcon: '/favicon.png',
  };

  // Setup Swagger with modified document and options
  SwaggerModule.setup('docs', app, document, options);

  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
    methods: '*',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

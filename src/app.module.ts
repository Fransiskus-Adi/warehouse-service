import { Module, UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { DBConfigType } from './types/db-config.type';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import configuration from './config/configuration';
import { APP_PIPE } from '@nestjs/core';
import { UserModule } from './modules/user/user.module';
import { CategoryModule } from './modules/category/category.module';
import { ProductModule } from './modules/product/product.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserEntity } from './entities/user.entity';
import { CategoryEntity } from './entities/category.entity';
import { ProductEntity } from './entities/product.entity';
import { TransactionEntity } from './entities/transaction.entity';
import { TransactionItemEntity } from './entities/transactionItem.entity';
import { MulterModule } from '@nestjs/platform-express';
import { multerConfig } from './config/multer-config';

export function moduleFactory({
  host, port, username, password
}: DBConfigType): any {
  const dbConfig: TypeOrmModuleAsyncOptions = {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      type: 'mysql',
      host: host || configService.get<string>('TYPEORM_HOST'),
      port: port || configService.get<string>('TYPEORM_PORT'),
      username: username || configService.get<string>('TYPEORM_USERNAME'),
      password: password || configService.get<string>('TYPEORM_PASSWORD'),
      database: configService.get<string>('TYPEORM_DATABASE'),
      entities: [
        UserEntity,
        CategoryEntity,
        ProductEntity,
        TransactionEntity,
        TransactionItemEntity
      ],
      synchronize: false,
      softDelete: true,
      logging: Boolean(configService.get<string>('TYPEORM_LOGGING')),
      migrationTableName: configService.get<string>('TYPEORM_MIGRATION_TABLE_NAME')
    })
  }

  @Module({
    imports: [
      ConfigModule.forRoot({
        load: [configuration],
        isGlobal: true,
      }),
      MulterModule.register({
        storage: multerConfig.storage
      }),
      TypeOrmModule.forRootAsync(dbConfig),
      UserModule,
      CategoryModule,
      ProductModule,
      TransactionModule,
      AuthModule,
    ],
    controllers: [],
    providers: [{
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        exceptionFactory: (errors) =>
          new UnprocessableEntityException(errors),
      }),
    }],
  })
  class AppModule { }
  return AppModule;
}


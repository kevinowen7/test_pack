import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './common/config';
import { ResepModule } from './resep/resep.module';
import { ResepDetailModule } from './resep-detail/resep-detail.module';
import { ObatModule } from './obat/obat.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('APP_DB_HOST'),
        port: +configService.get<number>('APP_DB_PORT'),
        username: configService.get('APP_DB_USER'),
        password: configService.get('APP_DB_PASS'),
        database: configService.get('APP_DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        autoLoadEntities: true,
        extra: {
          ssl: configService.get('APP_ENVIRONMENT') == "local" ? false : { rejectUnauthorized: false }
        }
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    ResepModule,
    ResepDetailModule,
    ObatModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
}

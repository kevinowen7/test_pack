import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestContextModule } from 'nestjs-request-context';
import { ObatEntity } from './entity/obat.entity';
import { ObatController } from './obat.controller';
import { ObatService } from './obat.service';
@Module({
  controllers: [ObatController],
  imports: [
    TypeOrmModule.forFeature([ObatEntity]),
    HttpModule,
    ConfigModule,
    RequestContextModule,
  ],
  providers: [
    ObatService,
  ],
  exports: [ObatService]
})
export class ObatModule { }

import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestContextModule } from 'nestjs-request-context';
import { ResepDetailEntity } from './entity/resep-detail.entity';
import { ResepDetailController } from './resep-detail.controller';
import { ResepDetailService } from './resep-detail.service';
import { ResepEntity } from '../resep/entity/resep.entity';
import { ObatEntity } from '../obat/entity/obat.entity';
@Module({
  controllers: [ResepDetailController],
  imports: [
    TypeOrmModule.forFeature([ResepDetailEntity, ResepEntity, ObatEntity]),
    HttpModule,
    ConfigModule,
    RequestContextModule,
  ],
  providers: [
    ResepDetailService,
  ],
  exports: [ResepDetailService]
})
export class ResepDetailModule { }

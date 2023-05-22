import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestContextModule } from 'nestjs-request-context';
import { ResepEntity } from './entity/resep.entity';
import { ResepController } from './resep.controller';
import { ResepService } from './resep.service';
import { ObatEntity } from '../obat/entity/obat.entity';
@Module({
  controllers: [ResepController],
  imports: [
    TypeOrmModule.forFeature([ResepEntity, ObatEntity]),
    HttpModule,
    ConfigModule,
    RequestContextModule,
  ],
  providers: [
    ResepService,
  ],
  exports: [ResepService]
})
export class ResepModule { }

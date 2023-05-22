import {
  ConflictException,
  ForbiddenException,
  Injectable, InternalServerErrorException, NotFoundException,
} from '@nestjs/common';
import { BaseRequestService } from '../common/service/base-request.service';
import { Connection, FindConditions, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { IPaginationMeta, IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { getOptionSort } from '../common/helper';
import { ResepDetailEntity } from './entity/resep-detail.entity';
import { CreateResepDetailRequestDto } from './dto/request/create-resep-detail-request.dto';
import { UpdateResepDetailRequestDto } from './dto/request/update-resep-detail-request.dto';
import { errorObatNotFound, errorResepDetailAlreadyExist, errorResepDetailNotFound, errorResepNotFound } from '../common/error-message';
import { ResepEntity } from '../resep/entity/resep.entity';
import { ObatEntity } from '../obat/entity/obat.entity';

@Injectable()
export class ResepDetailService extends BaseRequestService {
  constructor(
    private connection: Connection,
    @InjectRepository(ResepDetailEntity)
    private resepDetailRepository: Repository<ResepDetailEntity>,
    @InjectRepository(ResepEntity)
    private resepRepository: Repository<ResepEntity>,
    @InjectRepository(ObatEntity)
    private obatRepository: Repository<ObatEntity>,
  ) {
    super();
  }

  async create(createResepDetailRequestDto: CreateResepDetailRequestDto): Promise<ResepDetailEntity> {
    let { resepId, obatId, qty } = createResepDetailRequestDto

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // handle when resepId not found
      const existResep = await this.resepRepository.findOne({ id: resepId });
      if (!existResep) throw new NotFoundException({
        data: null,
        success: false,
        message: errorResepNotFound,
      });

      // handle when obatId not found
      const existObat = await this.obatRepository.findOne({ id: obatId });
      if (!existObat) throw new NotFoundException({
        data: null,
        success: false,
        message: errorObatNotFound,
      });

      // Handle unique resepId & obatId
      const existResepDetail = await this.findOneByAttribute({ resepId, obatId });
      if (existResepDetail) throw new ConflictException({
        data: null,
        success: false,
        message: errorResepDetailAlreadyExist,
      });

      const konfigurasiharga = (existObat.konfigurasiHargaId == 1) ? 1.1 * existObat.price : existObat.price;

      // ResepDetailntity
      const resepDetailEntity = new ResepDetailEntity();
      resepDetailEntity.id = uuid();
      resepDetailEntity.resepId = resepId;
      resepDetailEntity.obatId = obatId;
      resepDetailEntity.qty = qty;
      resepDetailEntity.obatName = existObat.obatName;
      resepDetailEntity.originalPrice = existObat.price;
      resepDetailEntity.konfigurasiHargaId = existObat.konfigurasiHargaId;
      resepDetailEntity.includeTax = existObat.includeTax;
      resepDetailEntity.finalPrice = (existObat.includeTax == true) ? (1.11 * konfigurasiharga) : konfigurasiharga;
      resepDetailEntity.totalPriceObat = resepDetailEntity.finalPrice * qty;
      resepDetailEntity.createdAt = new Date();
      await queryRunner.manager.insert<ResepDetailEntity>(ResepDetailEntity, resepDetailEntity);

      await queryRunner.commitTransaction();

      return resepDetailEntity;
    } catch (error) {
      console.error(error);
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(`${error.message}. failed to create ResepDetail`);
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: string, updateResepDetailRequestDto: UpdateResepDetailRequestDto): Promise<ResepDetailEntity> {
    let { qty } = updateResepDetailRequestDto

    const resepDetail = await this.findOneByAttribute({ id });
    if (!resepDetail) throw new NotFoundException({
      data: null,
      success: false,
      message: errorResepDetailNotFound,
    });

    if (qty) {
      const existResep = await this.resepRepository.findOne({ id: resepDetail.resepId });
      if (!existResep) throw new NotFoundException({
        data: null,
        success: false,
        message: errorResepNotFound,
      });

      const existObat = await this.obatRepository.findOne({ id: resepDetail.obatId });
      if (!existObat) throw new NotFoundException({
        data: null,
        success: false,
        message: errorObatNotFound,
      });

      const konfigurasiharga = (existObat.konfigurasiHargaId == 1) ? (0.1 * existObat.price) + existObat.price : existObat.price;
      resepDetail.qty = qty;
      resepDetail.finalPrice = (existObat.includeTax == true) ? ((0.11 * konfigurasiharga) + konfigurasiharga) : konfigurasiharga;
      resepDetail.totalPriceObat = resepDetail.finalPrice * qty;
    }

    const updatedData = await this.resepDetailRepository.save(resepDetail);
    return updatedData;
  }

  async getById(id: string): Promise<ResepDetailEntity> {
    const resepDetail = await this.findOneByAttribute({ id });
    if (!resepDetail) throw new NotFoundException({
      data: null,
      success: false,
      message: errorResepDetailNotFound,
    });

    return resepDetail;
  }

  async delete(id: string): Promise<ResepDetailEntity> {
    const resepDetail = await this.findOneByAttribute({ id });
    if (!resepDetail) throw new NotFoundException({
      data: null,
      success: false,
      message: errorResepDetailNotFound,
    });

    return await this.resepDetailRepository.softRemove(resepDetail);
  }

  async findByAttribute(findOption: Record<string, any>): Promise<ResepDetailEntity[]> {
    return await this.resepDetailRepository.find(findOption);
  }

  async findOneByAttribute(findOption: Record<string, any>): Promise<ResepDetailEntity> {
    return await this.resepDetailRepository.findOne(findOption);
  }
}

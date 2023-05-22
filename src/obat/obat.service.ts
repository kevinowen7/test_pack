import {
  ForbiddenException,
  Injectable, InternalServerErrorException, NotFoundException,
} from '@nestjs/common';
import { Connection, FindConditions, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { IPaginationMeta, IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { BaseRequestService } from '../common/service/base-request.service';
import { ObatEntity } from './entity/obat.entity';
import { CreateObatRequestDto } from './dto/request/create-obat-request.dto';
import { UpdateObatRequestDto } from './dto/request/update-obat-request.dto';
import { FilterObatDto } from './dto/request/filter-obat-request.dto';
import { getOptionSort } from '../common/helper';
import { errorObatNotFound } from '../common/error-message';

@Injectable()
export class ObatService extends BaseRequestService {
  constructor(
    private connection: Connection,
    @InjectRepository(ObatEntity)
    private obatRepository: Repository<ObatEntity>,
  ) {
    super();
  }

  async create(createObatRequestDto: CreateObatRequestDto): Promise<ObatEntity> {
    let { obatName, sku, price, konfigurasiHargaId, includeTax, stock } = createObatRequestDto
    const existObat = await this.findOneByAttribute({ sku });
    if (existObat) throw new NotFoundException({
      data: null,
      success: false,
      message: errorObatNotFound,
    });


    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Obatntity
      const obatEntity = new ObatEntity();
      obatEntity.id = uuid();
      obatEntity.obatName = obatName;
      obatEntity.sku = sku;
      obatEntity.price = price;
      obatEntity.konfigurasiHargaId = konfigurasiHargaId;
      obatEntity.includeTax = includeTax;
      obatEntity.stock = stock;
      obatEntity.createdAt = new Date();
      await queryRunner.manager.insert<ObatEntity>(ObatEntity, obatEntity);

      await queryRunner.commitTransaction();

      return obatEntity;
    } catch (error) {
      console.error(error);
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(`${error.message}. failed to create Obat`);
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: string, updateObatRequestDto: UpdateObatRequestDto): Promise<ObatEntity> {
    let { obatName, sku, price, konfigurasiHargaId, includeTax, stock } = updateObatRequestDto

    const obat = await this.findOneByAttribute({ id });
    if (!obat) throw new NotFoundException({
      data: null,
      success: false,
      message: errorObatNotFound,
    });

    if (sku != obat.sku) {
      const existObatSku = await this.findOneByAttribute({ sku });
      if (existObatSku) throw new NotFoundException({
        data: null,
        success: false,
        message: errorObatNotFound,
      });
    }


    if (obatName) obat.obatName = obatName;
    if (sku) obat.sku = sku;
    if (price) obat.price = price;
    if (konfigurasiHargaId) obat.konfigurasiHargaId = konfigurasiHargaId;
    if (includeTax) obat.includeTax = includeTax;
    if (stock) obat.stock = stock;

    const updatedData = await this.obatRepository.save(obat);
    return updatedData;
  }

  async paginate(filterObatDto: FilterObatDto): Promise<Pagination<ObatEntity, IPaginationMeta>> {
    const { obatName, sku, page, limit, sort } = filterObatDto

    try {
      let payloadFilter: FindConditions<ObatEntity> = {
      }
      const optionSort = getOptionSort(sort);
      if (obatName) payloadFilter.obatName = Like(`%${obatName}%`);
      if (sku) payloadFilter.sku = sku;

      const paginateOptions: IPaginationOptions<any> = {
        page: (page) ?? 1,
        limit: (limit) ?? 10,
      };

      return await paginate<ObatEntity>(this.obatRepository, paginateOptions, {
        where: payloadFilter,
        order: { [optionSort.key]: optionSort.value }
      });
    } catch (error) {
      throw new InternalServerErrorException({
        data: null,
        success: false,
        message: error.message,
      });
    }
  }

  async getById(id: string): Promise<ObatEntity> {
    const obat = await this.findOneByAttribute({ id });
    if (!obat) throw new NotFoundException({
      data: null,
      success: false,
      message: errorObatNotFound,
    });

    return obat;
  }

  async delete(id: string): Promise<ObatEntity> {
    const obat = await this.findOneByAttribute({ id });
    if (!obat) throw new NotFoundException({
      data: null,
      success: false,
      message: errorObatNotFound,
    });

    return await this.obatRepository.softRemove(obat);
  }

  async findByAttribute(findOption: Record<string, any>): Promise<ObatEntity[]> {
    return await this.obatRepository.find(findOption);
  }

  async findOneByAttribute(findOption: Record<string, any>): Promise<ObatEntity> {
    return await this.obatRepository.findOne(findOption);
  }
}

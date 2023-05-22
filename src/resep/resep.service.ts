import {
  BadRequestException,
  ForbiddenException,
  Injectable, InternalServerErrorException, NotFoundException,
} from '@nestjs/common';
import { BaseRequestService } from '../common/service/base-request.service';
import { Connection, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { ResepEntity } from './entity/resep.entity';
import { CreateResepRequestDto } from './dto/request/create-resep-request.dto';
import { UpdateResepRequestDto } from './dto/request/update-resep-request.dto';
import { errorResepAlreadyCancel, errorResepAlreadyConfirm, errorResepNotFound } from '../common/error-message';
import { ResepStatusEnum } from './enum/resep.enum';
import { ObatEntity } from '../obat/entity/obat.entity';

@Injectable()
export class ResepService extends BaseRequestService {
  constructor(
    private connection: Connection,
    @InjectRepository(ResepEntity)
    private resepRepository: Repository<ResepEntity>,
    @InjectRepository(ObatEntity)
    private obatRepository: Repository<ObatEntity>,
  ) {
    super();
  }

  async create(createResepRequestDto: CreateResepRequestDto): Promise<ResepEntity> {
    let { patientName, clinicName, doctorName } = createResepRequestDto

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // resepEntity
      const resepEntity = new ResepEntity();
      resepEntity.id = uuid();
      resepEntity.patientName = patientName;
      resepEntity.clinicName = clinicName;
      resepEntity.doctorName = doctorName;
      resepEntity.status = ResepStatusEnum.CREATED;
      resepEntity.createdAt = new Date();
      await queryRunner.manager.insert<ResepEntity>(ResepEntity, resepEntity);

      await queryRunner.commitTransaction();

      return await this.getById(resepEntity.id);
    } catch (error) {
      console.error(error);
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(`${error.message}. failed to create Resep`);
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: string, updateResepRequestDto: UpdateResepRequestDto): Promise<ResepEntity> {
    let { patientName, clinicName, doctorName } = updateResepRequestDto

    const resep = await this.findOneByAttribute({ id });
    if (!resep) throw new NotFoundException({
      data: null,
      success: false,
      message: errorResepNotFound,
    });

    if (patientName) resep.patientName = patientName;
    if (clinicName) resep.clinicName = clinicName;
    if (doctorName) resep.doctorName = doctorName;

    const updatedData = await this.resepRepository.save(resep);
    return await this.getById(updatedData.id);
  }

  async confirm(id: string): Promise<ResepEntity> {
    const resep = await this.getById(id);
    if (!resep) throw new NotFoundException({
      data: null,
      success: false,
      message: errorResepNotFound,
    });

    if (resep.status === ResepStatusEnum.CONFIRMED) throw new BadRequestException({
      data: null,
      success: false,
      message: errorResepAlreadyConfirm,
    });

    if (resep.status === ResepStatusEnum.CANCELLED) throw new BadRequestException({
      data: null,
      success: false,
      message: errorResepAlreadyCancel,
    });

    resep.status = ResepStatusEnum.CONFIRMED;
    for await (const resepDetail of resep.resepDetails) {
      const obat = await this.obatRepository.findOne({ id: resepDetail.obatId });
      obat.stock = obat.stock - resepDetail.qty;
      await this.obatRepository.save(obat);
    }

    const updatedData = await this.resepRepository.save(resep);
    return updatedData;
  }

  async cancel(id: string): Promise<ResepEntity> {
    const resep = await this.getById(id);
    if (!resep) throw new NotFoundException({
      data: null,
      success: false,
      message: errorResepNotFound,
    });

    if (resep.status === ResepStatusEnum.CONFIRMED) throw new BadRequestException({
      data: null,
      success: false,
      message: errorResepAlreadyConfirm,
    });

    if (resep.status === ResepStatusEnum.CANCELLED) throw new BadRequestException({
      data: null,
      success: false,
      message: errorResepAlreadyCancel,
    });

    resep.status = ResepStatusEnum.CANCELLED;
    const updatedData = await this.resepRepository.save(resep);
    return updatedData;
  }

  async getById(id: string): Promise<ResepEntity> {
    const resep = await this.findOneByAttribute({
      where: { id },
      relations: ['resepDetails'],
    });
    resep.totalHarga = resep.resepDetails.reduce((a, b) => +a + +b.totalPriceObat, 0);

    if (!resep) throw new NotFoundException({
      data: null,
      success: false,
      message: errorResepNotFound,
    });

    return resep;
  }

  async delete(id: string): Promise<ResepEntity> {
    const resep = await this.findOneByAttribute({ id });
    if (!resep) throw new NotFoundException({
      data: null,
      success: false,
      message: errorResepNotFound,
    });

    return await this.resepRepository.softRemove(resep);
  }

  async findByAttribute(findOption: Record<string, any>): Promise<ResepEntity[]> {
    return await this.resepRepository.find(findOption);
  }

  async findOneByAttribute(findOption: Record<string, any>): Promise<ResepEntity> {
    return await this.resepRepository.findOne(findOption);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseResponseDto } from '../common/dto/base-response.dto';
import { StatusCodes } from 'http-status-codes/build/cjs';
import { ConfigService } from '@nestjs/config';
import { BaseResponsePaginationDto } from '../common/dto/base-response-pagination.dto';
import { MetaObject } from '../common/class/pagination.class';
import { ObatService } from './obat.service';
import { UpdateObatRequestDto } from './dto/request/update-obat-request.dto';
import { CreateObatRequestDto } from './dto/request/create-obat-request.dto';
import { ObatEntity } from './entity/obat.entity';
import { FilterObatDto } from './dto/request/filter-obat-request.dto';

@Controller('obat')
@ApiTags('obat')
export class ObatController {
  constructor(
    private configService: ConfigService,
    private obatService: ObatService,
  ) { }

  @Post('/')
  @HttpCode(StatusCodes.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createObatRequestDto: CreateObatRequestDto): Promise<BaseResponseDto<ObatEntity>> {
    const result = await this.obatService.create(createObatRequestDto);
    return BaseResponseDto.successResponse(result, 'Create Obat success.');
  }

  @Patch('/:id')
  @HttpCode(StatusCodes.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(@Param('id') id: string, @Body() updateObatRequestDto: UpdateObatRequestDto): Promise<BaseResponseDto<ObatEntity>> {
    const result = await this.obatService.update(id, updateObatRequestDto);
    return BaseResponseDto.successResponse(result, 'Update Obat success.');
  }

  @Get('/')
  @HttpCode(StatusCodes.OK)
  async paginate(@Query() filterObatDto: FilterObatDto): Promise<BaseResponseDto<ObatEntity[]>> {
    const result = await this.obatService.paginate(filterObatDto);

    const metaData = new MetaObject();
    metaData.totalItems = result.meta.totalItems;
    metaData.itemCount = result.meta.itemCount;
    metaData.itemsPerPage = result.meta.itemsPerPage;
    metaData.totalPages = result.meta.totalPages;
    metaData.currentPage = result.meta.currentPage;

    return BaseResponsePaginationDto.successResponse(result.items, metaData, 'Get Obat Success.');
  }

  @Get('/:id')
  @HttpCode(StatusCodes.OK)
  async getById(@Param('id') id: string): Promise<BaseResponseDto<ObatEntity>> {
    const result = await this.obatService.getById(id);
    return BaseResponseDto.successResponse(result, 'Get Obat Success.');
  }

  @Delete('/:id')
  @HttpCode(StatusCodes.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async delete(@Param('id') id: string): Promise<BaseResponseDto<ObatEntity>> {
    const result = await this.obatService.delete(id);
    return BaseResponseDto.successResponse(result, 'Delete Obat Success.');
  }

}

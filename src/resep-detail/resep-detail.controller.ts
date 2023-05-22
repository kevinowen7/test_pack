import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BaseResponseDto } from '../common/dto/base-response.dto';
import { StatusCodes } from 'http-status-codes/build/cjs';
import { ConfigService } from '@nestjs/config';
import { ResepDetailService } from './resep-detail.service';
import { CreateResepDetailRequestDto } from './dto/request/create-resep-detail-request.dto';
import { ResepDetailEntity } from './entity/resep-detail.entity';
import { UpdateResepDetailRequestDto } from './dto/request/update-resep-detail-request.dto';

@Controller('resep-detail')
@ApiTags('resep-detail')
@ApiBearerAuth()
export class ResepDetailController {
  constructor(
    private configService: ConfigService,
    private resepDetailService: ResepDetailService,
  ) { }

  @Post('/')
  @HttpCode(StatusCodes.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createResepDetailRequestDto: CreateResepDetailRequestDto): Promise<BaseResponseDto<ResepDetailEntity>> {
    const result = await this.resepDetailService.create(createResepDetailRequestDto);
    return BaseResponseDto.successResponse(result, 'Create resepDetail success.');
  }

  @Patch('/:id')
  @HttpCode(StatusCodes.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(@Param('id') id: string, @Body() updateResepDetailRequestDto: UpdateResepDetailRequestDto): Promise<BaseResponseDto<ResepDetailEntity>> {
    const result = await this.resepDetailService.update(id, updateResepDetailRequestDto);
    return BaseResponseDto.successResponse(result, 'Update resepDetail success.');
  }

  @Get('/:id')
  @HttpCode(StatusCodes.OK)
  async getById(@Param('id') id: string): Promise<BaseResponseDto<ResepDetailEntity>> {
    const result = await this.resepDetailService.getById(id);
    return BaseResponseDto.successResponse(result, 'Get resepDetail Success.');
  }

  @Delete('/:id')
  @HttpCode(StatusCodes.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async delete(@Param('id') id: string): Promise<BaseResponseDto<ResepDetailEntity>> {
    const result = await this.resepDetailService.delete(id);
    return BaseResponseDto.successResponse(result, 'Delete resepDetail Success.');
  }

}

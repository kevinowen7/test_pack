import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BaseResponseDto } from '../common/dto/base-response.dto';
import { StatusCodes } from 'http-status-codes/build/cjs';
import { ConfigService } from '@nestjs/config';
import { ResepService } from './resep.service';
import { ResepEntity } from './entity/resep.entity';
import { UpdateResepRequestDto } from './dto/request/update-resep-request.dto';
import { CreateResepRequestDto } from './dto/request/create-resep-request.dto';

@Controller('Resep')
@ApiTags('Resep')
@ApiBearerAuth()
export class ResepController {
  constructor(
    private configService: ConfigService,
    private resepService: ResepService,
  ) { }

  @Post('/')
  @HttpCode(StatusCodes.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createResepRequestDto: CreateResepRequestDto): Promise<BaseResponseDto<ResepEntity>> {
    const result = await this.resepService.create(createResepRequestDto);
    return BaseResponseDto.successResponse(result, 'Create Resep success.');
  }

  @Patch('/:id')
  @HttpCode(StatusCodes.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(@Param('id') id: string, @Body() updateResepRequestDto: UpdateResepRequestDto): Promise<BaseResponseDto<ResepEntity>> {

    const result = await this.resepService.update(id, updateResepRequestDto);
    return BaseResponseDto.successResponse(result, 'Update Resep success.');
  }

  @Get('/:id')
  @HttpCode(StatusCodes.OK)
  async getById(@Param('id') id: string): Promise<BaseResponseDto<ResepEntity>> {
    const result = await this.resepService.getById(id);
    return BaseResponseDto.successResponse(result, 'Get Resep Success.');
  }

  @Post('/confirm/:id')
  @HttpCode(StatusCodes.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async confirm(@Param('id') id: string): Promise<BaseResponseDto<ResepEntity>> {
    const result = await this.resepService.confirm(id);
    return BaseResponseDto.successResponse(result, 'Confirm Resep success.');
  }

  @Post('/cancel/:id')
  @HttpCode(StatusCodes.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async cancel(@Param('id') id: string): Promise<BaseResponseDto<ResepEntity>> {
    const result = await this.resepService.cancel(id);
    return BaseResponseDto.successResponse(result, 'Cancel Resep success.');
  }


  @Delete('/:id')
  @HttpCode(StatusCodes.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async delete(@Param('id') id: string): Promise<BaseResponseDto<ResepEntity>> {
    const result = await this.resepService.delete(id);
    return BaseResponseDto.successResponse(result, 'Delete Resep Success.');
  }

}

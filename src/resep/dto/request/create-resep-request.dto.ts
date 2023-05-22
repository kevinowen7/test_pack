import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { ResepStatusEnum } from '../../enum/resep.enum';

export class CreateResepRequestDto {
  @IsNotEmpty()
  patientName: string;

  @IsNotEmpty()
  clinicName: string;

  @IsNotEmpty()
  doctorName: string;
}

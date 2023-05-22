import {
  IsEnum,
  IsOptional,
} from 'class-validator';
import { ResepStatusEnum } from '../../enum/resep.enum';

export class UpdateResepRequestDto {
  @IsOptional()
  patientName: string;

  @IsOptional()
  clinicName: string;

  @IsOptional()
  doctorName: string;
}



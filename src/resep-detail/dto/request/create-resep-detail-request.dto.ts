import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreateResepDetailRequestDto {
  @IsNotEmpty()
  resepId: string;

  @IsNotEmpty()
  obatId: string;

  @IsNotEmpty()
  qty: number;
}

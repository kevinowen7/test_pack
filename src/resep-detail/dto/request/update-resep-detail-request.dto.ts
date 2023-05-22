import {
  IsArray,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class UpdateResepDetailRequestDto {
  @IsNotEmpty()
  resepId: string;

  @IsNotEmpty()
  obatId: string;

  @IsNotEmpty()
  qty: number;
}



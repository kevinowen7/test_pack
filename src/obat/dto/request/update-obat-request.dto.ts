import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Max,
  Min,
} from 'class-validator';

export class UpdateObatRequestDto {
  @IsOptional()
  obatName?: string;

  @IsOptional()
  sku?: string;

  @IsOptional()
  price?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(2)
  konfigurasiHargaId?: number;

  @IsOptional()
  includeTax?: boolean;

  @IsOptional()
  @IsNumber()
  stock?: number;
}



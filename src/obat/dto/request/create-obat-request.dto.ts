import {
  IsNotEmpty,
  IsNumber,
  Max,
  Min,
} from 'class-validator';

export class CreateObatRequestDto {
  @IsNotEmpty()
  obatName: string;

  @IsNotEmpty()
  sku: string;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(2)
  konfigurasiHargaId: number;

  @IsNotEmpty()
  includeTax: boolean;

  @IsNotEmpty()
  @IsNumber()
  stock: number;
}

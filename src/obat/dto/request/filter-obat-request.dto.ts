import {
  IsOptional,
} from 'class-validator';

export class FilterObatDto {
  @IsOptional()
  obatName: string;

  @IsOptional()
  sku: string;

  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;

  @IsOptional()
  sort?: string;
}

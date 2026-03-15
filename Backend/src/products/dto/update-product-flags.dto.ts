import { IsBoolean, IsISO8601, IsNumber, IsOptional } from 'class-validator';

export class UpdateProductFlagsDto {
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsBoolean()
  isFlashSale?: boolean;

  @IsOptional()
  @IsISO8601()
  flashSaleEnd?: string | null;

  @IsOptional()
  @IsNumber()
  flashSalePrice?: number | null;

  @IsOptional()
  @IsBoolean()
  allowCredit?: boolean;
}

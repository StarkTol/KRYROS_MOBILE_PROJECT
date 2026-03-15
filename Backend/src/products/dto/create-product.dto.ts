import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, Min, ValidateIf } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  name!: string;

  @IsString()
  sku!: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price!: number;

  @IsString()
  description!: string;

  @IsString()
  @IsOptional()
  shortDescription?: string;

  @IsString()
  @IsOptional()
  categorySlug?: string;

  @IsString()
  @IsOptional()
  brandSlug?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  brandId?: number;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  isFeatured?: boolean;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  allowCredit?: boolean;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  creditMinimum?: number;

  @IsArray()
  @ValidateIf((o) => Array.isArray(o.imageDataUrls))
  @IsOptional()
  imageDataUrls?: string[];

  @IsArray()
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch (e) {
        return value;
      }
    }
    return value;
  })
  specifications?: { key: string; value: string }[];
}

import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBrandDto, UpdateBrandDto } from './dto/brand.dto';

@Injectable()
export class BrandsService {
  constructor(private prisma: PrismaService) {}

  private slugify(text: string): string {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')     // Replace spaces with -
      .replace(/[^\w-]+/g, '')   // Remove all non-word chars
      .replace(/--+/g, '-');    // Replace multiple - with single -
  }

  async create(dto: CreateBrandDto) {
    const slug = dto.slug || this.slugify(dto.name);
    
    // Check for existing slug
    const existing = await this.prisma.brand.findUnique({
      where: { slug }
    });

    if (existing) {
      throw new ConflictException('Brand with this slug already exists');
    }

    return this.prisma.brand.create({
      data: {
        ...dto,
        slug
      },
    });
  }

  async findAll() {
    return this.prisma.brand.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number) {
    const brand = await this.prisma.brand.findUnique({
      where: { id },
      include: {
        products: true
      }
    });
    if (!brand) throw new NotFoundException('Brand not found');
    return brand;
  }

  async update(id: number, dto: UpdateBrandDto) {
    await this.findOne(id);
    
    const data: any = { ...dto };
    if (dto.name && !dto.slug) {
      data.slug = this.slugify(dto.name);
    }

    return this.prisma.brand.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.brand.delete({
      where: { id },
    });
  }
}

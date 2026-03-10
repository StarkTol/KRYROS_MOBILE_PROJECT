import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';

@Injectable()
export class CMSService {
  constructor(private prisma: PrismaService) {}

  async getBanners() {
    return this.prisma.cMSBanner.findMany({
      where: { isActive: true },
      orderBy: { position: 'asc' },
    });
  }

  async listBanners() {
    return this.prisma.cMSBanner.findMany({
      orderBy: { position: 'asc' },
    });
  }

  async createBanner(data: CreateBannerDto) {
    return this.prisma.cMSBanner.create({ data });
  }

  async updateBanner(id: string, data: UpdateBannerDto) {
    return this.prisma.cMSBanner.update({
      where: { id },
      data,
    });
  }

  async deleteBanner(id: string) {
    return this.prisma.cMSBanner.delete({ where: { id } });
  }

  async getSections() {
    return this.prisma.cMSSection.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
  }

  async getPage(slug: string) {
    return this.prisma.cMSPage.findUnique({ where: { slug } });
  }

  // Sections management
  async listSections() {
    return this.prisma.cMSSection.findMany({ orderBy: { order: 'asc' } });
  }

  async createSection(data: CreateSectionDto) {
    return this.prisma.cMSSection.create({ data: { ...data } as any });
  }

  async updateSection(id: string, data: UpdateSectionDto) {
    return this.prisma.cMSSection.update({ where: { id }, data: { ...data } as any });
  }

  async deleteSection(id: string) {
    return this.prisma.cMSSection.delete({ where: { id } });
  }

  async seedSections() {
    // Ensure a Categories Grid section exists and enabled
    const section = await this.prisma.cMSSection.findFirst({
      where: {
        OR: [{ type: 'categories' }, { title: 'Shop by Category' }],
      },
    });
    if (!section) {
      await this.prisma.cMSSection.create({
        data: {
          type: 'categories',
          title: 'Shop by Category',
          subtitle: 'Browse our wide range of tech products',
          isActive: true,
          order: 3,
        } as any,
      });
    } else if (!section.isActive) {
      await this.prisma.cMSSection.update({
        where: { id: section.id },
        data: { isActive: true },
      });
    }

    // Ensure a Wholesale Deals section exists and enabled (with sample items)
    const wholesale = await this.prisma.cMSSection.findFirst({
      where: { type: 'wholesale_deals' },
    });
    if (!wholesale) {
      await this.prisma.cMSSection.create({
        data: {
          type: 'wholesale_deals',
          title: 'Featured Wholesale Deals',
          isActive: true,
          order: 5,
          config: {
            items: [
              { title: 'iPhone 13 (Bulk)', subtitle: 'Min 10 units', price: 9999, minQty: 10 },
              { title: 'MacBook Air M2 (Bulk)', subtitle: 'Min 5 units', price: 54999, minQty: 5 },
              { title: 'Samsung S24 (Bulk)', subtitle: 'Min 8 units', price: 39999, minQty: 8 },
            ],
          } as any,
        } as any,
      });
    }

    return { success: true };
  }
}

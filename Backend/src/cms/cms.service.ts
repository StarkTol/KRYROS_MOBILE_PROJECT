import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';

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
}

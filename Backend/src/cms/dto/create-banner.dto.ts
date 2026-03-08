export class CreateBannerDto {
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
  linkText?: string;
  isActive?: boolean;
  position?: number;
  startDate?: Date;
  endDate?: Date;
}

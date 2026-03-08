export class UpdateBannerDto {
  title?: string;
  subtitle?: string;
  image?: string;
  link?: string;
  linkText?: string;
  isActive?: boolean;
  position?: number;
  startDate?: Date | null;
  endDate?: Date | null;
}

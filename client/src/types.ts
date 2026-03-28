export type CarStatus = "AVAILABLE" | "SOLD" | "HIDDEN";
export type DiscountType = "PERCENTAGE" | "FIXED";

export type CarImage = {
  id: string;
  imageUrl: string;
  imageName: string;
  altText: string | null;
  sortOrder: number;
  isCover: boolean;
  createdAt: string;
};

export type Discount = {
  id: string;
  carId: string;
  type: DiscountType;
  value: number;
  isActive: boolean;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
};

export type Car = {
  id: string;
  slug: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  description: string;
  mileage: number;
  fuelType: string;
  transmission: string;
  color: string;
  condition: string;
  status: CarStatus;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  images: CarImage[];
  discount: Discount | null;
  coverImage: CarImage | null;
  pricing: {
    originalPrice: number;
    finalPrice: number;
    discountActive: boolean;
    savings: number;
  };
};

export type Service = {
  id: string;
  title: string;
  slug: string;
  description: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type SiteContent<T = Record<string, unknown> | null> = {
  id: string;
  key: string;
  title: string;
  content: string;
  jsonData: T;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Inquiry = {
  id: string;
  kind: "CONTACT" | "CAR";
  carId: string | null;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  createdAt: string;
  car?: Pick<Car, "title" | "slug"> | null;
};

export type HomeData = {
  featuredCars: Car[];
  services: Service[];
  homepageContent: SiteContent<{
    heroPrimaryCta?: string;
    heroSecondaryCta?: string;
    stats?: Array<{ label: string; value: string }>;
    whyChooseUs?: string[];
  }> | null;
  aboutContent: SiteContent<{
    missionTitle?: string;
    missionBody?: string;
    valuesTitle?: string;
    values?: string[];
    teamTitle?: string;
    teamBody?: string;
  }> | null;
  locationContent: SiteContent<{
    address?: string;
    mapEmbedUrl?: string;
    hours?: Array<{ day: string; hours: string }>;
    notes?: string;
    phone?: string;
  }> | null;
  contactContent: SiteContent<{
    phone?: string;
    email?: string;
    whatsapp?: string;
    recipientEmail?: string;
    address?: string;
    hours?: Array<{ day: string; hours: string }>;
    socialLinks?: Array<{ label: string; url: string }>;
  }> | null;
};

export type DashboardData = {
  stats: {
    totalCars: number;
    availableCars: number;
    soldCars: number;
    featuredCars: number;
    totalServices: number;
    totalInquiries: number;
  };
  recentCars: Car[];
  recentInquiries: Inquiry[];
};

export type AdminUser = {
  id: string;
  email: string;
  role: string;
};

export type AdminContentMap = Record<string, SiteContent<any>>;

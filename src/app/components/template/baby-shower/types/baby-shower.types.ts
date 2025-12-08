import { Image } from '../../module/galery/galery';

export type babyShower = {
  photoUrl: string;
  title: string;
  subtitle: string;
  date: Date;
  duration_hours?: number;
  timezone: string;
  guests: string[];
  instagram_tag?: string;
  contact?: {
    whatsapp_number?: number;
  };
  dress_code?: {
    enabled: boolean;
    description?: string;
  };
  food_details?: {
    enabled: boolean;
    title?: string;
    content?: string;
  };
  location_details?: {
    enabled: boolean;
    title?: string;
    content?: string;
  };
  venue: {
    name: string;
    address: string;
    city: string;
    country: string;
    state?: string;
    latitude?: number;
    longitude?: number;
    instructions?: string;
  };
  notes: {
    enabled: boolean;
    title: string;
    content: Array<{ icon: string; text: string }>;
  };
  rsvp: {
    enabled: boolean;
    deadline?: Date;
    contact_whatsapp?: number;
    max_plus_ones?: number;
    fields: Array<{
      name: string;
      email?: string;
      phone?: string;
      attending: boolean;
      notes?: string;
    }>;
  };
  gift: {
    enabled: boolean;
    enabled_collective_gift?: boolean;
    ideas?: Array<{
      img_url: string;
      title: string;
      link: string;
    }>;
    payment_QR_code_url?: string;
    payment_QR_code_instructions?: string;
    gift_list_url?: string;
    instructions?: string;
  };
  design: {
    template_id: string;
    color_scheme?: string;
    gallery_images?: Image[];
    font_pair?: {
      heading: string;
      body: string;
    };
    sharing: {
      meta: {
        title: string;
        description: string;
        image_url?: string;
      };
      template?: string;
    };
  };
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ReactNode } from 'react';

export interface Product {
  id: number;
  name: string;
  price: string;
  description: string;
  field: string;
  brand: string;
  app: string;
  img: string;
  productType?: string;
}

export interface Project {
  id: number;
  type: 'software' | 'equipment' | 'services';
  img: string;
  location: string;
  name: string;
  tags: string[];
  size?: 'wide' | 'tall' | 'small' | 'full';
}

export interface NewsItem {
  category: string;
  title: string;
  date: string;
  desc: string;
  img: string;
}

export interface Partner {
  name: string;
  logo: string;
}

export interface HeroSlide {
  img: string;
  title: string;
  sub: string;
}

export interface NavLink {
  name: string;
  href: string;
  active?: boolean;
  dropdown?: { name: string; href: string }[];
}

export interface EventSpeaker {
  name: string;
  role: string;
  company: string;
  avatar: string;
  bio?: string;
}

export interface EventAgendaItem {
  time: string;
  title: string;
  description?: string;
  speaker?: string;
}

export interface EventItem {
  id: string;
  title: string;
  shortDesc: string;
  longDesc: string;
  img: string;
  date: string; // e.g. "15/08/2026"
  startDate: string; // ISO string "2026-08-15"
  endDate?: string;
  location: string;
  address?: string;
  eventType?: string; // e.g. "Webinar", "Workshop", "Hội thảo", "Triển lãm", "Lễ ký kết"
  isFeatured?: boolean; // Highlight for Hero Event
  status: 'upcoming' | 'ongoing' | 'past'; // upcoming = Sắp diễn ra, ongoing = Đang diễn ra, past = Đã diễn ra
  isOpenRegistration: boolean; // Đang mở đăng ký
  targetAudience: string[];
  agenda: EventAgendaItem[];
  speakers: EventSpeaker[];
  media: {
    gallery: string[];
    videoUrl?: string;
  };
  documents: {
    name: string;
    size: string;
    url: string;
  }[];
}

export interface EventRegistration {
  eventId: string;
  eventTitle: string;
  fullName: string;
  company: string;
  position: string;
  email: string;
  phone: string;
  attendeesCount: number;
  note?: string;
  consent: boolean;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  registeredAt: string;
}

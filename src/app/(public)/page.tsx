import type { Metadata } from 'next';
import { HomeRoute } from './HomeRoute';
export const metadata: Metadata = { title: 'CIC Technology — Đối tác công nghệ chiến lược', description: 'Sản phẩm, dịch vụ tư vấn và dự án công nghệ của CIC Technology.' };
export default function HomePage() { return <HomeRoute />; }

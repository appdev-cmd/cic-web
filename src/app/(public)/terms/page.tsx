import type { Metadata } from 'next';
import { TermsRoute } from './TermsRoute';
export const metadata: Metadata = { title: 'Điều khoản sử dụng | CIC Technology', description: 'Quy định về quyền hạn, trách nhiệm, sở hữu trí tuệ và sử dụng tài nguyên tại CIC Technology.' };
export default function TermsPage() { return <TermsRoute />; }

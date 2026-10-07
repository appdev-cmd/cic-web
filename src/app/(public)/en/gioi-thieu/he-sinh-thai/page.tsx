import { redirect } from 'next/navigation';

export default function EnHeSinhThaiRedirect() {
  redirect('/en/about?tab=ecosystem');
}

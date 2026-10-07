import { redirect } from 'next/navigation';

export default function EnCoCauToChucRedirect() {
  redirect('/en/about?tab=structure');
}

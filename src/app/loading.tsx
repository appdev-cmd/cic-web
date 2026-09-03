import { ApplicationLoadingState } from '@/shared/ui/application';

export default function RootLoading() {
  return (
    <main className="foundation-shell">
      <div className="foundation-content">
        <ApplicationLoadingState />
      </div>
    </main>
  );
}

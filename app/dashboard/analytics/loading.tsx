import { LoadingSpinner } from "../../components/ui/loading-spinner";

export default function AnalyticsLoading() {
  return (
    <div className="h-[60vh] flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
} 
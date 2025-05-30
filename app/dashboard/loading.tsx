import { LoadingSpinner } from "../components/ui/loading-spinner";

export default function DashboardLoading() {
  return (
    <div className="h-[80vh] flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
} 
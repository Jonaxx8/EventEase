import { LoadingSpinner } from "@/app/components/ui/loading-spinner";

export default function UsersLoading() {
  return (
    <div className="h-[60vh] flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
} 
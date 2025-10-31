import { Loader } from 'lucide-react';

const DashboardLoadingPage = () => {
  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <Loader className="size-6 animate-spin text-muted-foreground" />
    </div>
  );
};
export default DashboardLoadingPage;
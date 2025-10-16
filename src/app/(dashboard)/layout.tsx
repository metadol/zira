import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}
const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-red-500 p-2">
      <div className="flex w-full h-full bg-green-500 p-2">
        <div className="fixed left-0 top-0 hidden lg:block lg:w-[264px] h-full bg-purple-500 overflow-y-auto p-2">
          <Sidebar />
        </div>

        <div className="lg:pl-[264px] bg-blue-500 w-full">
          <div className="mx-auto max-w-screen-2xl h-full bg-yellow-500 p-2">
            <Navbar />
            <main className="flex flex-col h-full py-8 px-6 bg-amber-800 ">
              {children}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

import { Dialog } from "@/components/ui/dialog";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import Navbar from "@/layouts/admin/Navbar";
import Sidebar from "@/layouts/admin/Sidebar";

export default function AdminLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="bg-red-100/60 h-screen">
        <Navbar/>
        <div className="flex flex-wrap">
            <div className="w-[15%]">
                <Sidebar/>
            </div>
            <div className="w-[85%] py-5 pr-10">
                {children}
            </div>
        </div>
    </div>
  );
}
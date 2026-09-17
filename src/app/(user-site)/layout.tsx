import Footer from "@/layouts/Footer";
import Header from "@/layouts/Header";

export default function UserLayout({ children }: LayoutProps<"/">) {
  return (
    <div>
        <Header/>
        {children}
        <Footer/>
    </div>
  );
}
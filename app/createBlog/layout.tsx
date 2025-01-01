import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/shared/Sidebar";

type Props = React.PropsWithChildren<{}>;

const conversationsLayout = ({ children }: Props) => {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarTrigger className="block sm:hidden" />
        {children}
      </SidebarProvider>
    </>
  );
};

export default conversationsLayout;

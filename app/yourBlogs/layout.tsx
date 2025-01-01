import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/shared/Sidebar";
import { Card } from "@/components/ui/card";

type Props = React.PropsWithChildren<{}>;

const conversationsLayout = ({ children }: Props) => {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <Card>
          <SidebarTrigger className="block sm:hidden" />
        </Card>
        
        {children}
      </SidebarProvider>
    </>
  );
};

export default conversationsLayout;

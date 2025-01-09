import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/shared/Sidebar";
import { Card } from "@/components/ui/card";

type Props = { children?: React.ReactNode };

const conversationsLayout = ({ children }: Props) => {
  return (
    <>
      <SidebarProvider className="flex flex-col sm:flex-row">
        <AppSidebar />

        <Card className="p-4 mt-5 mx-5 flex items-center sm:hidden">
          <SidebarTrigger className="block sm:hidden" />
        </Card>

        {children}
      </SidebarProvider>
    </>
  );
};

export default conversationsLayout;

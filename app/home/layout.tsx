import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/shared/Sidebar";
import { Card } from "@/components/ui/card";

type Props = React.PropsWithChildren<{}>;

const conversationsLayout = ({ children }: Props) => {
  return (
    <>
      <SidebarProvider className="flex flex-col">
        <AppSidebar />

        <Card className="p-4 mt-5 mx-5 flex items-center">
          <SidebarTrigger className="block sm:hidden" />
        </Card>

        {children}
      </SidebarProvider>
    </>
  );
};

export default conversationsLayout;

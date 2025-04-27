import RootProvider from "@/components/provider";
import { Toaster } from "@/components/ui/toaster";

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="">
      <main className="h-full ">
        <Toaster />
        <RootProvider >{children}</RootProvider>
      </main>
    </div>
  );
};

export default RootLayout;

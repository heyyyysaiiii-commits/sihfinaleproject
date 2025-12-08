import { Navigation } from "./Navigation";
import { useMediaQuery } from "@/hooks/use-mobile";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const isMobile = !useMediaQuery("(min-width: 1024px)");

  return (
    <div className="flex flex-col h-screen bg-background">
      <Navigation />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div
          className={`${
            isMobile ? "px-4 py-4 pb-20" : "px-8 py-8"
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

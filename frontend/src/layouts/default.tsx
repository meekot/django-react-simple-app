import { Link } from "@heroui/link";

import { Navbar } from "@/components/navbar";

export default function DefaultLayout({
  children,
  showNavigation,
  username,
}: {
  children: React.ReactNode;
  showNavigation?: boolean;
  username?: string;
}) {
  return (
    <div className="relative flex flex-col h-screen">
      <Navbar showNavigation={showNavigation ?? true} username={username} />
      <main className="container mx-auto max-w-7xl px-6 flex-grow pt-16">
        {children}
      </main>
      <footer className="w-full flex items-center justify-center py-3">
        <Link
          isExternal
          className="flex items-center gap-1 text-current"
          href="https://meekot.com"
          title="meekot.com homepage"
        >
          <span className="text-default-600">Powered by</span>
          <p className="text-primary">Meekot</p>
        </Link>
      </footer>
    </div>
  );
}

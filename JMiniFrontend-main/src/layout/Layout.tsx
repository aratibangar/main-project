import { Outlet, Link } from "react-router-dom";

export default function Layout({
  isExpenseSplitDashboard,
}: {
  isExpenseSplitDashboard: boolean;
}) {
  return (
    <div className="flex flex-col h-screen">
      {isExpenseSplitDashboard && (
        <>
          <header className="w-full bg-background border-b p-4 sticky top-0 z-99">
            <div className="container mx-auto flex justify-between items-center">
              <div className="text-xl font-bold">DreamsDoc</div>
              <nav>
                <ul className="flex gap-6">
                  <li>
                    <Link to="/" className="hover:underline">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link to="/login" className="hover:underline">
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link to="/dashboard" className="hover:underline">
                      Dashboard
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </header>
          <main className="flex-1 container mx-auto p-4 overflow-y-scroll">
            <Outlet />
          </main>
          <footer className="bg-background border-t p-4 text-center text-sm text-muted-foreground">
            <div className="container mx-auto">
              <p>© 2025 DreamsDoc All rights reserved.</p>
            </div>
          </footer>
        </>
      )}
      {/* <Outlet/> */}
    </div>
  );
}

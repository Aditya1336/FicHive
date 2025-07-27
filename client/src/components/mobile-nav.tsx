import { Home, Search, Bookmark, User } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function MobileNav() {
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-40">
      <div className="flex items-center justify-around py-3">
        <Link href="/">
          <button className={`flex flex-col items-center ${isActive('/') ? 'text-blue-600' : 'text-gray-500'}`}>
            <Home className="w-5 h-5 mb-1" />
            <span className="text-xs">Home</span>
          </button>
        </Link>
        <button className="flex flex-col items-center text-gray-500">
          <Search className="w-5 h-5 mb-1" />
          <span className="text-xs">Search</span>
        </button>
        <button className="flex flex-col items-center text-gray-500">
          <Bookmark className="w-5 h-5 mb-1" />
          <span className="text-xs">Library</span>
        </button>
        <button className="flex flex-col items-center text-gray-500">
          <User className="w-5 h-5 mb-1" />
          <span className="text-xs">Profile</span>
        </button>
      </div>
    </nav>
  );
}

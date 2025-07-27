import { useState } from "react";
import { Link } from "wouter";
import { Search, BookOpen, PenTool, UserCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function Header({ searchQuery, onSearchChange }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center">
              <BookOpen className="text-2xl text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">FictionVault</h1>
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">
                Browse
              </Link>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">
                Popular
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">
                New
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">
                Completed
              </a>
            </nav>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search stories, fandoms, authors..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <Button className="bg-blue-600 text-white hover:bg-blue-700">
              <PenTool className="w-4 h-4 mr-2" />
              Write
            </Button>
            <button className="text-gray-700 hover:text-blue-600">
              <UserCircle className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

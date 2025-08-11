import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, List, Sun, Moon } from "lucide-react";
import { CalendarGrid } from "@/components/calendar-grid";
import { EventForm } from "@/components/event-form";
import { EventList } from "@/components/event-list";
import { useTheme } from "@/components/theme-provider";
import type { Event } from "@shared/schema";

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { theme, toggleTheme } = useTheme();

  // Load view mode from localStorage
  useEffect(() => {
    const storedViewMode = localStorage.getItem('calendarViewMode') as "grid" | "list";
    if (storedViewMode) {
      setViewMode(storedViewMode);
    }
  }, []);

  // Save view mode to localStorage
  useEffect(() => {
    localStorage.setItem('calendarViewMode', viewMode);
  }, [viewMode]);

  const { data: events = [], isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleTodayClick = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === "grid" ? "list" : "grid");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex items-center justify-center">
        <div className="text-center fade-in">
          <div className="w-16 h-16 border-4 border-google-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-gray-600 dark:text-dark-text-secondary font-medium">Loading Eventra...</div>
          <div className="text-sm text-gray-500 dark:text-dark-text-secondary mt-2">Preparing your calendar experience</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg transition-colors duration-300 fade-in">
      {/* Header */}
      <header className="bg-white dark:bg-dark-surface shadow-sm border-b border-gray-200 dark:border-dark-border glass-effect sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3 slide-in">
              <div className="w-8 h-8 bg-google-blue rounded-lg flex items-center justify-center hover-lift card-shadow">
                <CalendarIcon className="text-white w-4 h-4" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:gradient-text">
                Eventra
              </h1>
            </div>
            
            {/* Controls */}
            <div className="flex items-center space-x-3">
              <Button 
                onClick={handleTodayClick}
                className="bg-google-blue hover:bg-blue-600 text-white hover-lift card-shadow focus-ring"
              >
                Today
              </Button>
              <Button
                variant="outline"
                onClick={toggleViewMode}
                className="bg-gray-100 dark:bg-dark-border text-gray-700 dark:text-dark-text border-gray-300 dark:border-dark-border hover:bg-gray-200 dark:hover:bg-gray-600 hover-lift card-shadow focus-ring"
              >
                {viewMode === "grid" ? (
                  <>
                    <List className="w-4 h-4 mr-2" />
                    List View
                  </>
                ) : (
                  <>
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    Grid View
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="text-gray-500 dark:text-dark-text-secondary hover:text-gray-700 dark:hover:text-dark-text hover-lift focus-ring"
              >
                {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Calendar/List Section */}
          <div className="flex-1">
            {viewMode === "grid" ? (
              <CalendarGrid
                currentDate={currentDate}
                selectedDate={selectedDate}
                events={events}
                onDateClick={handleDateClick}
                onCurrentDateChange={setCurrentDate}
              />
            ) : (
              <EventList
                events={events}
                viewMode={viewMode}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-96 space-y-6">
            <EventForm />
            {viewMode === "grid" && (
              <EventList
                events={events}
                selectedDate={selectedDate || undefined}
                viewMode={viewMode}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

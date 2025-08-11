import { format, startOfWeek, addDays, startOfMonth, endOfMonth, endOfWeek, isSameMonth, isSameDay, parseISO, addMonths, subMonths } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Event } from "@shared/schema";

interface CalendarGridProps {
  currentDate: Date;
  selectedDate: Date | null;
  events: Event[];
  onDateClick: (date: Date) => void;
  onCurrentDateChange: (date: Date) => void;
}

export function CalendarGrid({ currentDate, selectedDate, events, onDateClick, onCurrentDateChange }: CalendarGridProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const handlePreviousMonth = () => {
    onCurrentDateChange(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    onCurrentDateChange(addMonths(currentDate, 1));
  };

  const renderHeader = () => {
    return (
      <div className="bg-google-blue px-6 py-4 flex justify-between items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePreviousMonth}
          className="text-white hover:text-blue-200 hover:bg-blue-600"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-xl font-semibold text-white">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNextMonth}
          className="text-white hover:text-blue-200 hover:bg-blue-600"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    );
  };

  const renderDaysOfWeek = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="bg-google-blue bg-opacity-90 grid grid-cols-7 text-center text-white text-sm font-medium py-3">
        {days.map(day => (
          <div key={day}>{day}</div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const dayEvents = events.filter(event => 
          isSameDay(parseISO(event.dateTime), cloneDay)
        );
        
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isSelected = selectedDate && isSameDay(day, selectedDate);
        const isToday = isSameDay(day, new Date());

        days.push(
          <div
            key={day.toString()}
            className={cn(
              "h-20 p-2 border-b border-gray-200 dark:border-dark-border cursor-pointer transition-all duration-200 relative hover-lift group",
              {
                "bg-gray-50 dark:bg-dark-bg": !isCurrentMonth,
                "bg-white dark:bg-dark-surface hover:bg-blue-50 dark:hover:bg-gray-700 hover:card-shadow": isCurrentMonth,
                "bg-blue-50 dark:bg-blue-900 ring-2 ring-google-blue ring-opacity-50 card-shadow": isSelected,
                "bg-blue-100 dark:bg-blue-900 ring-2 ring-google-blue card-shadow": isToday && !isSelected,
              }
            )}
            onClick={() => onDateClick(cloneDay)}
          >
            <span className={cn(
              "text-sm font-medium",
              {
                "text-gray-400 dark:text-dark-text-secondary": !isCurrentMonth,
                "text-gray-900 dark:text-dark-text": isCurrentMonth,
              }
            )}>
              {format(day, 'd')}
            </span>
            {isToday && !isSelected && (
              <span className="text-xs text-gray-600 dark:text-dark-text-secondary">
                Today
              </span>
            )}
            {dayEvents.length > 0 && (
              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                <div className="bg-google-yellow text-xs px-2 py-1 rounded-full text-gray-800 card-shadow animate-pulse">
                  {dayEvents.length} event{dayEvents.length > 1 ? 's' : ''}
                </div>
              </div>
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 divide-x divide-gray-200 dark:divide-dark-border" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }

    return rows;
  };

  return (
    <Card className="bg-white dark:bg-dark-surface border-gray-200 dark:border-dark-border overflow-hidden card-shadow-lg hover:card-shadow-hover transition-all duration-300">
      {renderHeader()}
      {renderDaysOfWeek()}
      <div className="fade-in">
        {renderCells()}
      </div>
    </Card>
  );
}

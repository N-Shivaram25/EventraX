import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, Trash2 } from "lucide-react";
import { format, parseISO, isSameDay } from "date-fns";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Event } from "@shared/schema";

interface EventListProps {
  events: Event[];
  selectedDate?: Date;
  viewMode: "grid" | "list";
}

export function EventList({ events, selectedDate, viewMode }: EventListProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const deleteEventMutation = useMutation({
    mutationFn: async (eventId: string) => {
      await apiRequest("DELETE", `/api/events/${eventId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      toast({
        title: "Event Deleted",
        description: "The event has been successfully removed.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete event. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleDeleteEvent = (eventId: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      deleteEventMutation.mutate(eventId);
    }
  };

  if (viewMode === "list") {
    // Group events by date for list view
    const eventsByDate = events.reduce((acc, event) => {
      const date = event.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(event);
      return acc;
    }, {} as Record<string, Event[]>);

    const sortedDates = Object.keys(eventsByDate).sort();

    if (sortedDates.length === 0) {
      return (
        <Card className="bg-white dark:bg-dark-surface border-gray-200 dark:border-dark-border">
          <CardContent className="p-12 text-center">
            <CalendarDays className="w-12 h-12 text-gray-400 dark:text-dark-text-secondary mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-dark-text mb-2">
              No Events Scheduled
            </h3>
            <p className="text-gray-600 dark:text-dark-text-secondary">
              Create your first event to get started with Eventra.
            </p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-4 fade-in">
        {sortedDates.map(date => (
          <Card key={date} className="bg-white dark:enhanced-card border-gray-200 dark:neon-border card-shadow-lg hover:card-shadow-hover hover-lift hover:dark:vibrant-glow transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-google-blue to-google-blue/90 dark:from-google-blue dark:to-google-green text-white">
              <CardTitle className="text-lg font-semibold">
                {format(parseISO(date), 'PPPP')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {eventsByDate[date].map(event => (
                  <div key={event.id} className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-dark-bg rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 card-shadow hover-lift">
                    <div className="flex-shrink-0 w-20 text-sm text-google-green font-semibold">
                      {event.time || 'All day'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base font-semibold text-gray-900 dark:text-dark-text mb-1">
                        {event.title}
                      </h4>
                      {event.description && (
                        <p className="text-sm text-gray-600 dark:text-dark-text-secondary">
                          {event.description}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteEvent(event.id)}
                      disabled={deleteEventMutation.isPending}
                      className="text-google-red hover:text-red-700 hover:bg-red-50 hover-lift focus-ring"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Grid view - show events for selected date
  if (!selectedDate) return null;

  const dayEvents = events.filter(event => 
    isSameDay(parseISO(event.dateTime), selectedDate)
  );

  return (
    <Card className="bg-white dark:enhanced-card border-gray-200 dark:neon-border card-shadow-lg hover:card-shadow-hover hover:dark:vibrant-glow transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-google-blue/5 to-google-green/5 dark:from-google-blue/10 dark:to-google-green/10 border-b border-gray-100 dark:border-dark-border">
        <CardTitle className="text-google-blue dark:gradient-text flex items-center gap-2 font-semibold">
          <CalendarDays className="w-5 h-5" />
          {format(selectedDate, 'PPPP')}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {dayEvents.length > 0 ? (
          <div className="space-y-3 fade-in">
            {dayEvents.map(event => (
              <div key={event.id} className="bg-gray-50 dark:bg-dark-bg rounded-lg p-4 border-l-4 border-google-blue hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover-lift card-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900 dark:text-dark-text">
                    {event.title}
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteEvent(event.id)}
                    disabled={deleteEventMutation.isPending}
                    className="text-google-red hover:text-red-700 hover:bg-red-50 hover-lift focus-ring"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                {event.time && (
                  <div className="text-sm text-google-green mb-1 flex items-center gap-1 font-medium">
                    <Clock className="w-3 h-3" />
                    {event.time}
                  </div>
                )}
                {event.description && (
                  <p className="text-sm text-gray-600 dark:text-dark-text-secondary">
                    {event.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-dark-text-secondary text-center py-8">
            No events for this day
          </p>
        )}
      </CardContent>
    </Card>
  );
}

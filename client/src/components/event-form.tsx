import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarPlus } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { InsertEvent } from "@shared/schema";

export function EventForm() {
  const [formData, setFormData] = useState<InsertEvent>({
    title: "",
    description: "",
    date: "",
    time: "",
    dateTime: "",
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createEventMutation = useMutation({
    mutationFn: async (eventData: InsertEvent) => {
      const response = await apiRequest("POST", "/api/events", eventData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      setFormData({
        title: "",
        description: "",
        date: "",
        time: "",
        dateTime: "",
      });
      toast({
        title: "Event Created",
        description: "Your event has been successfully added to the calendar.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.date) return;

    const eventDateTime = `${formData.date}T${formData.time || "00:00"}`;
    
    createEventMutation.mutate({
      ...formData,
      dateTime: eventDateTime,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Card className="bg-white dark:bg-dark-surface border-gray-200 dark:border-dark-border">
      <CardHeader>
        <CardTitle className="text-google-blue flex items-center gap-2">
          <CalendarPlus className="w-5 h-5" />
          Add New Event
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-gray-700 dark:text-dark-text">
              Title *
            </Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter event title"
              className="bg-white dark:bg-dark-bg border-gray-300 dark:border-dark-border text-gray-900 dark:text-dark-text"
            />
          </div>
          
          <div>
            <Label htmlFor="date" className="text-gray-700 dark:text-dark-text">
              Date *
            </Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="bg-white dark:bg-dark-bg border-gray-300 dark:border-dark-border text-gray-900 dark:text-dark-text"
            />
          </div>
          
          <div>
            <Label htmlFor="time" className="text-gray-700 dark:text-dark-text">
              Time
            </Label>
            <Input
              id="time"
              name="time"
              type="time"
              value={formData.time}
              onChange={handleChange}
              className="bg-white dark:bg-dark-bg border-gray-300 dark:border-dark-border text-gray-900 dark:text-dark-text"
            />
          </div>
          
          <div>
            <Label htmlFor="description" className="text-gray-700 dark:text-dark-text">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter event description (optional)"
              className="bg-white dark:bg-dark-bg border-gray-300 dark:border-dark-border text-gray-900 dark:text-dark-text resize-vertical"
              rows={3}
            />
          </div>
          
          <Button
            type="submit"
            disabled={createEventMutation.isPending}
            className="w-full bg-google-blue hover:bg-blue-600 text-white"
          >
            {createEventMutation.isPending ? (
              "Adding..."
            ) : (
              <>
                <CalendarPlus className="w-4 h-4 mr-2" />
                Add Event
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

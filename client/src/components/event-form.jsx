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
export function EventForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    dateTime: "",
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createEventMutation = useMutation({
    mutationFn: async (eventData) => {
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

  const handleSubmit = (e) => {
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
    <Card className="bg-white dark:enhanced-card border-gray-200 dark:neon-border card-shadow-lg hover:card-shadow-hover hover-lift transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-google-blue/5 to-google-green/5 dark:from-google-blue/10 dark:to-google-green/10 border-b border-gray-100 dark:border-dark-border">
        <CardTitle className="text-google-blue dark:gradient-text flex items-center gap-2 font-semibold">
          <CalendarPlus className="w-5 h-5" />
          Add New Event
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-gray-700 dark:text-dark-text font-medium">
              Title *
            </Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter event title"
              className="bg-white dark:bg-dark-bg border-gray-300 dark:border-dark-border text-gray-900 dark:text-dark-text focus-ring transition-all duration-200"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date" className="text-gray-700 dark:text-dark-text font-medium">
              Date *
            </Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="bg-white dark:bg-dark-bg border-gray-300 dark:border-dark-border text-gray-900 dark:text-dark-text focus-ring transition-all duration-200"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="time" className="text-gray-700 dark:text-dark-text font-medium">
              Time
            </Label>
            <Input
              id="time"
              name="time"
              type="time"
              value={formData.time || ""}
              onChange={handleChange}
              className="bg-white dark:bg-dark-bg border-gray-300 dark:border-dark-border text-gray-900 dark:text-dark-text focus-ring transition-all duration-200"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-700 dark:text-dark-text font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              placeholder="Enter event description (optional)"
              className="bg-white dark:bg-dark-bg border-gray-300 dark:border-dark-border text-gray-900 dark:text-dark-text resize-vertical focus-ring transition-all duration-200"
              rows={3}
            />
          </div>
          
          <Button
            type="submit"
            disabled={createEventMutation.isPending}
            className="w-full bg-google-blue hover:bg-blue-600 text-white hover-lift card-shadow focus-ring transition-all duration-200 font-medium"
          >
            {createEventMutation.isPending ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Adding...
              </div>
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

"use client";
import { fetchNotifications } from "@/utils/fetchNotifications";
import type React from "react";
import { useEffect, useState } from "react";
import {
  Bell,
  Clock,
  User,
  Filter,
  X,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import api from "@/config/axios.config";

interface Notification {
  id: string;
  _id: string;
  receiver: string;
  type: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  isSeen: boolean;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserNotifications = async () => {
      setLoading(true);
      try {
        const data = await fetchNotifications("admin");
        console.log("Notifications - data:", data);
        setNotifications(data);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserNotifications();
  }, []);

  const markAsRead = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    const result = await api.patch(`/api/v1/notifications/${id}`, {
      isSeen: true,
    });
    console.log("Mark as read result:", result);

    // Implement your mark as read functionality here
    setNotifications(
      notifications.map((notification) =>
        notification.id === id
          ? { ...notification, isSeen: true }
          : notification,
      ),
    );
  };

  const markAllAsRead = async () => {
    // Implement your mark all as read functionality here
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        isSeen: true,
      })),
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "mentor_request":
        return <User className="h-5 w-5 text-primary" />;
      default:
        return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getNotificationTypeLabel = (type: string) => {
    switch (type) {
      case "mentor_request":
        return "Listener Request";
      default:
        return "Notification";
    }
  };

  const filteredNotifications = filter
    ? notifications.filter((n) => n.type === filter)
    : notifications;

  const unreadCount = notifications.filter((n) => !n.isSeen).length;
  const notificationTypes = [...new Set(notifications.map((n) => n.type))];

  return (
    <div className="w-full px-4 py-8 bg-background">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">
              Notifications
            </h1>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="font-medium">
                {unreadCount}
                {/* unread */}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* {unreadCount > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={markAllAsRead}
                      className="h-9 w-9"
                    >
                      <CheckCheck className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Mark all as read</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )} */}

            {notificationTypes.length > 1 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn("gap-1.5", filter && "bg-secondary")}
                  >
                    <Filter className="h-3.5 w-3.5" />
                    {filter ? getNotificationTypeLabel(filter) : "All types"}
                    {filter && (
                      <X
                        className="h-3.5 w-3.5 text-muted-foreground"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFilter(null);
                        }}
                      />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setFilter(null)}>
                    All types
                  </DropdownMenuItem>
                  {notificationTypes.map((type) => (
                    <DropdownMenuItem
                      key={type}
                      onClick={() => setFilter(type)}
                    >
                      {getNotificationTypeLabel(type)}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden border border-border/50">
                <CardContent className="p-0">
                  <div className="p-4 flex items-start gap-4">
                    <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <div className="flex justify-between">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredNotifications.length === 0 ? (
          <Card className="border border-dashed bg-background">
            <CardContent className="flex flex-col items-center justify-center p-12">
              <div className="rounded-full bg-muted p-3 mb-4">
                <Bell className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-1">No notifications</h3>
              <p className="text-sm text-muted-foreground text-center max-w-sm">
                {filter
                  ? `You don't have any ${getNotificationTypeLabel(filter).toLowerCase()} notifications.`
                  : "You're all caught up! Check back later for updates."}
              </p>
              {filter && (
                <Button
                  variant="link"
                  className="mt-4"
                  onClick={() => setFilter(null)}
                >
                  View all notifications
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <a
                key={notification.id}
                href={`/dashboard/listener-requests?listenerId=${notification.id}`}
                className="block"
              >
                <Card
                  className={cn(
                    "overflow-hidden transition-all duration-200 hover:shadow-sm",
                    !notification.isSeen
                      ? "bg-primary/[0.03] border-primary/20"
                      : "border-border/50 hover:bg-muted/30",
                  )}
                >
                  <CardContent className="p-0">
                    <div className="p-4 flex gap-4">
                      <div
                        className={cn(
                          "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
                          !notification.isSeen ? "bg-primary/10" : "bg-muted",
                        )}
                      >
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <p
                                className={cn(
                                  "text-sm",
                                  !notification.isSeen
                                    ? "font-medium"
                                    : "text-foreground/90",
                                )}
                              >
                                {notification.content}
                              </p>
                              {!notification.isSeen && (
                                <span className="flex-shrink-0 h-1.5 w-1.5 rounded-full bg-primary"></span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 mt-1.5">
                              <Badge
                                variant="outline"
                                className="px-1.5 py-0 h-5 text-xs font-normal text-muted-foreground border-border/50"
                              >
                                {getNotificationTypeLabel(notification.type)}
                              </Badge>
                              <span className="flex items-center text-xs text-muted-foreground">
                                <Clock className="h-3 w-3 mr-1 inline-block" />
                                {formatDistanceToNow(
                                  new Date(notification.createdAt),
                                  { addSuffix: true },
                                )}
                              </span>
                            </div>
                          </div>

                          {/* {!notification.isSeen && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs flex-shrink-0"
                              onClick={(e) => markAsRead(e, notification.id)}
                            >
                              <CheckCircle className="h-3 w-3 mr-1.5" />
                              Mark read
                            </Button>
                          )} */}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ChevronDown, Clock, Mail, Menu } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { UserDropdown } from "./UserDropdown";
import Loading from "@/app/loading";
import { AnimatePresence, motion } from "framer-motion";
import { fetchNotifications } from "@/utils/fetchNotifications";
import moment from "moment";
import { socketService } from "@/services/socket.service";
import { get_socket } from "@/utils/get-socket";
import { useAppointments } from "@/hooks/useAppointments";
import { AppointmentService } from "@/services/appointment.service";
import { Socket } from "socket.io-client";
import { useUserStore } from "@/services/user.service";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";

// Advanced Navigation Types
interface NavItemBase {
  id: string;
  name: string;
  href: string;
  onClick?: () => void;
}

interface NavItemWithDropdown extends NavItemBase {
  dropdown: {
    id: string;
    label: string;
    link: string;
    onClick?: () => void;
  }[];
}

type NavItem = NavItemBase | NavItemWithDropdown;

// Navigation Configuration
const mainNavItems: NavItem[] = [
  {
    id: "about",
    name: "About",
    href: "/about",
  },
  {
    id: "how-works",
    name: "How It Works",
    href: "/how-it-works",
  },
  {
    id: "apply",
    name: "Apply",
    href: "/apply",
    dropdown: [
      // {
      //   id: "quote",
      //   label: "Get a Quote",
      //   link: "/get-a-quote",
      // },
      {
        id: "listener",
        label: "Apply for listener",
        link: "/listener-registration",
      },
    ],
  },
  {
    id: "blog",
    name: "Blog",
    href: "/blog",
  },
  {
    id: "donate",
    name: "Donate",
    href: "/donate",
  },
  {
    id: "community",
    name: "Community",
    href: "/community",
  },
  {
    id: "more",
    name: "More",
    href: "#",
    dropdown: [
      {
        id: "faq",
        label: "FAQ",
        link: "/faq",
      },
      {
        id: "contact",
        label: "Contact",
        link: "/contact",
      },
      {
        id: "analysis-report",
        label: "Resources",
        link: "/analysis-report",
      },
      // {
      //   id: "crisis-intervention",
      //   label: "Crisis Intervention Plan",
      //   link: "/crisis",
      // },
    ],
  },
];

// Utility function to check dropdown
function hasDropdown(item: NavItem): item is NavItemWithDropdown {
  return "dropdown" in item;
}

// Mobile Accordion Item Component
const MobileAccordionItem: React.FC<{
  item: NavItem;
  pathname: string;
  depth?: number;
}> = ({ item, pathname }) => {
  const [isOpen, setIsOpen] = useState(false);

  const renderDropdownItems = () => {
    if (!hasDropdown(item)) return null;

    return (
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: 1,
              height: "auto",
              transition: {
                duration: 0.3,
                ease: "easeInOut",
              },
            }}
            exit={{
              opacity: 0,
              height: 0,
              transition: {
                duration: 0.2,
                ease: "easeInOut",
              },
            }}
            className="pl-4 space-y-2 overflow-hidden"
          >
            {item.dropdown.map((subItem, index) => (
              <motion.li
                key={subItem.id}
                initial={{
                  opacity: 0,
                  x: -10,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                  transition: {
                    delay: index * 0.05,
                    duration: 0.2,
                  },
                }}
                exit={{
                  opacity: 0,
                  x: -10,
                  transition: {
                    duration: 0.1,
                  },
                }}
              >
                <SheetClose asChild>
                  <Link
                    href={subItem.link}
                    className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
                  >
                    {subItem.label}
                  </Link>
                </SheetClose>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    );
  };

  if (hasDropdown(item)) {
    return (
      <li className="border rounded-md overflow-hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2">{item.name}</div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={16} />
          </motion.div>
        </button>
        {renderDropdownItems()}
      </li>
    );
  }

  return (
    <li className="border rounded-md font-medium text-gray-900 text-sm">
      <SheetClose asChild>
        {item.onClick ? (
          <Button
            onClick={item.onClick}
            variant="ghost"
            className="block w-full text-left px-3 py-2"
          >
            {item.name}
          </Button>
        ) : (
          <Link
            href={item.href}
            className={`block px-3 py-2 ${pathname === item.href ? "bg-gray-200" : ""}`}
          >
            {item.name}
          </Link>
        )}
      </SheetClose>
    </li>
  );
};

const Header: React.FC = () => {
  // const { toast } = useToast();
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const {
    user: currentUser,
    initialized,
    fetchUserById,
    error,
  } = useUserStore();

  const [socket, setSocket] = useState<Socket | null>(null);
  const [newNotification, setNewNotification] = useState(false);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    const intervalId = setInterval(() => {
      if (user?.id) {
        fetchUserById(user.id);
      }
    }, 5000); // 3000ms = 3 seconds

    fetchUserById(user.id);

    // Cleanup on unmount or user.id change
    return () => clearInterval(intervalId);
  }, [user?.id]);

  useEffect(() => {
    if (!user) return;

    if (initialized && (!currentUser?.data || error !== null)) {
      logout();

      toast.error("You're removed as listener by admin!", {
        duration: 15000,
      });
    }
  }, [initialized, currentUser, error]);

  useEffect(() => {
    setSocket(get_socket());
  }, []);

  useEffect(() => {
    if (!socket || !user) return;
    socket.emit("join", { fromUsername: user.userName });
  }, [user, socket]);
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setIsLoading(true);
        const response = await AppointmentService.getAppointments({
          menteeUserName: user?.userName,
          status: "confirmed",
        });
        const appointmentData = response.data as any;

        setAppointments(appointmentData.data);
      } catch (err) {
      } finally {
        setIsLoading(false);
      }
    };
    if (user?.userName && user?.role === "mentee") fetchAppointments();
  }, [user?.userName, user, showChat]);

  useEffect(() => {
    if (!socket || !user) return;
    socket.on("notification", (data: any) => {
      if (!loading && (user?.role === "admin" || user?.role === "mentor")) {
        setNotifications((prevNotifications) => [data, ...prevNotifications]);
        setNewNotification(true);
      }
    });

    return () => {
      socket.off("notification");
    };
  }, [user?.role, loading, socket]);

  useEffect(() => {
    if (!socket) return;

    socket.on("is-able-to-chat", (_data: any) => {
      setShowChat(!showChat);
    });
  }, [socket]);

  useEffect(() => {
    const fetchUserNotifications = async (role: "admin" | "mentor") => {
      console.log(266, { role });
      setNotificationsLoading(true);
      try {
        if (!user) return;
        let data;
        if (role === "admin") data = await fetchNotifications(role);
        else data = await fetchNotifications("listener", user?.userName);
        setNotifications(data);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setNotificationsLoading(false);
      }
    };

    if (user && (user?.role === "admin" || user?.role === "mentor")) {
      fetchUserNotifications(user?.role as any);
    }
  }, [user?.role, user]);
  // User navigation items
  const userNavItems: NavItem[] = user
    ? [
        ...(currentUser?.data?.role === "admin"
          ? [
              {
                id: "dashboard",
                name: "Dashboard",
                href: "/dashboard/listeners",
              },
            ]
          : currentUser?.data?.role === "mentor" &&
              currentUser?.data?.adminApproval
            ? [
                {
                  id: "dashboard",
                  name: "Dashboard",
                  href: "/dashboard/booked-calls",
                },
              ]
            : []),
        {
          id: "logout",
          name: "Logout",
          href: "",
          onClick: logout,
        },
      ]
    : [
        {
          id: "login",
          name: "Login",
          href: "/login",
        },
      ];

  const combinedNavItems = [...mainNavItems, ...userNavItems];

  if (isLoading) {
    return <Loading />;
  }

  // Mobile Navigation Trigger
  const MobileNavTrigger = () => (
    <div className="lg:hidden flex items-center">
      {currentUser?.data ? (
        <div className="flex items-center gap-4 text-soft-paste">
          {currentUser?.data?.role !== "admin" &&
            currentUser?.data?.role !== "mentee" && (
              <Link href="/chat">
                <Mail size={18} className="text-soft-paste" />
              </Link>
            )}
          {currentUser?.data?.role === "mentee" &&
            !isLoading &&
            !!appointments?.find(
              (item: any) =>
                currentUser?.data?.userName === item?.menteeUserName &&
                item?.status === "confirmed",
            ) && (
              <Link href="/chat">
                <Mail size={18} className="text-soft-paste" />
              </Link>
            )}

          {currentUser?.data?.role !== "mentee" && (
            <>
              <Button
                variant="none"
                size="none"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setNewNotification(false);
                }}
                className="relative bg-teal-100 p-2 rounded-lg cursor-default"
              >
                <svg
                  className="w-[22px] h-[22px] text-teal-600 animate-wiggle"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 21 21"
                >
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.585 15.5H5.415A1.65 1.65 0 0 1 4 13a10.526 10.526 0 0 0 1.5-5.415V6.5a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v1.085c0 1.907.518 3.78 1.5 5.415a1.65 1.65 0 0 1-1.415 2.5zm1.915-11c-.267-.934-.6-1.6-1-2s-1.066-.733-2-1m-10.912 3c.209-.934.512-1.6.912-2s1.096-.733 2.088-1M13 17c-.667 1-1.5 1.5-2.5 1.5S8.667 18 8 17"
                  />
                </svg>
                {newNotification && (
                  <div className="px-1 py-0.5 bg-teal-500 w-[10px] h-[10px] rounded-full text-center text-white text-xs absolute -top-2 -end-1 translate-x-1/4 text-nowrap">
                    <div className="absolute top-0 start-0 rounded-full -z-10 animate-ping bg-teal-200 w-full h-full"></div>
                  </div>
                )}
              </Button>

              {showNotifications && <Notifications />}
            </>
          )}

          {/* <Button variant="ghost" size="icon">
            <Bell size={20} />
          </Button> */}
          <SheetTrigger onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={24} />
          </SheetTrigger>
        </div>
      ) : (
        <SheetTrigger onClick={() => setIsMobileMenuOpen(true)}>
          <Menu size={26} className="text-soft-paste-dark" />
        </SheetTrigger>
      )}
    </div>
  );

  // Notification

  const Notifications = () => (
    <div className="absolute shadow-2xl top-[60px] md:top-14 right-0 p-5 rounded-md w-full md:w-[35rem] z-50 bg-[#9e8cdd] text-white">
      <h2 className="text-white text-xl">Notifications</h2>
      {notificationsLoading ? (
        <p>Loading notifications...</p>
      ) : (
        <ul className="flex flex-col gap-5 mt-10 h-full max-h-[60vh] scrollbar-hide overflow-y-scroll">
          {notifications.map((notification, index) => (
            <Link key={index} href={"/dashboard/notifications"}>
              <li className="flex items-center gap-5">
                <Image
                  src={"/images/avatar/man.png"}
                  alt={"man"}
                  width={70}
                  height={70}
                  className={""}
                />
                <div className=" text-white">
                  <p>{notification.content} </p>

                  <div className="text-sm text-white opacity-70 flex items-center gap-2">
                    <span>{notification.type}</span>
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      <span>{moment(notification.createdAt).fromNow()}</span>
                    </div>
                  </div>
                </div>
              </li>
            </Link>
          ))}
        </ul>
      )}

      {!notificationsLoading && notifications.length === 0 && (
        <ul>
          <li className="text-center mt-6 py-8 opacity-60">
            notification not available
          </li>
        </ul>
      )}
    </div>
  );

  // Mobile Navigation Sheet
  const MobileNavSheet = () => (
    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
      <MobileNavTrigger />
      <SheetContent
        side="left"
        className="p-0 w-[320px] max-w-[90vw] flex flex-col"
      >
        <SheetHeader className="p-4 border-b flex flex-row items-center justify-between">
          <SheetTitle>
            <Link href="/" className="flex items-center">
              <Image
                src="/images/logo.svg"
                alt="Anonymous Voices Logo"
                width={100}
                height={50}
                className="h-10 w-auto"
              />
            </Link>
          </SheetTitle>
        </SheetHeader>

        <nav className="p-4 overflow-y-auto flex-grow">
          <motion.ul className="space-y-2 font-semibold">
            <AnimatePresence>
              {combinedNavItems.map((item) => (
                <MobileAccordionItem
                  key={item.id}
                  item={item}
                  pathname={pathname}
                />
              ))}
              {/* <div className="flex items-center text-sm bg-soft-paste text-white font-bold rounded-lg space-x-2 px-4 py-2">
                <Link href="/login">Login</Link>
                <span>/</span>
                <Link href="/signup">Sign Up</Link>
              </div> */}
            </AnimatePresence>
          </motion.ul>
        </nav>

        <SheetFooter className="p-4 border-t text-start">
          <p className="text-[10px] text-gray-400">
            &copy; {new Date().getFullYear()} Anonymous Voices. All rights
            reserved.
          </p>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );

  // Desktop Navigation
  const DesktopNavigation = () => (
    <nav className="hidden lg:flex space-x-4 lg:space-x-8">
      {mainNavItems.map((item) => (
        <div key={item.name} className="relative group">
          {hasDropdown(item) ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center px-1 pt-1 text-sm font-semibold text-gray-500 hover:text-gray-700">
                {item.name}
                <ChevronDown className="ml-1 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {item.dropdown.map((subItem) => (
                  <DropdownMenuItem key={subItem.label}>
                    <Link
                      href={subItem.link}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {subItem.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href={item.href}
              className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                pathname === item.href
                  ? "text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {item.name}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );

  // Desktop User Actions
  const DesktopUserActions = () => (
    <div className="hidden lg:flex items-center space-x-3 relative">
      {user ? (
        <div className="flex items-center space-x-2 text-soft-paste">
          {currentUser?.data?.role !== "admin" &&
            currentUser?.data?.role !== "mentee" && (
              <Link href="/chat">
                <Mail size={18} className="text-soft-paste" />
              </Link>
            )}
          {currentUser?.data?.role === "mentee" &&
            !isLoading &&
            !!appointments?.find(
              (item: any) =>
                currentUser?.data?.userName === item?.menteeUserName &&
                item?.status === "confirmed",
            ) && (
              <Link href="/chat">
                <Mail size={18} className="text-soft-paste" />
              </Link>
            )}

          {currentUser?.data?.role !== "mentee" && (
            <>
              <Button
                variant="none"
                size="none"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setNewNotification(false);
                }}
                className="relative bg-teal-100 p-2 rounded-lg cursor-pointer"
              >
                <svg
                  className="h-[22px] w-[22px] text-teal-600 animate-wiggle"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 21 21"
                >
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.585 15.5H5.415A1.65 1.65 0 0 1 4 13a10.526 10.526 0 0 0 1.5-5.415V6.5a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v1.085c0 1.907.518 3.78 1.5 5.415a1.65 1.65 0 0 1-1.415 2.5zm1.915-11c-.267-.934-.6-1.6-1-2s-1.066-.733-2-1m-10.912 3c.209-.934.512-1.6.912-2s1.096-.733 2.088-1M13 17c-.667 1-1.5 1.5-2.5 1.5S8.667 18 8 17"
                  />
                </svg>
                {newNotification && (
                  <div className="px-1 py-0.5 bg-teal-500 w-[10px] h-[10px] rounded-full text-center text-white text-xs absolute -top-2 -end-1 translate-x-1/4 text-nowrap">
                    <div className="absolute top-0 start-0 rounded-full -z-10 animate-ping bg-teal-200 w-full h-full"></div>
                  </div>
                )}
              </Button>

              {showNotifications && <Notifications />}
            </>
          )}

          <UserDropdown
            userRole={{
              role: currentUser?.data?.role,
              logout,
            }}
          />
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="border-soft-paste-hover">
            <Link href="/login">Login</Link>
          </Button>
          <Button className="bg-soft-paste">
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <header className="sticky top-0 left-0 w-full bg-white border-b py-1 z-50">
      <div className="container mx-auto px-4 relative">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/images/logo.svg"
              alt="Anonymous Voices Logo"
              width={100}
              height={100}
              className="w-auto h-12 sm:h-16"
            />
          </Link>

          {/* Desktop Navigation */}
          <DesktopNavigation />

          {/* Desktop User Actions */}
          <DesktopUserActions />

          {/* Mobile Navigation */}
          <MobileNavSheet />
        </div>
      </div>
    </header>
  );
};

export default Header;

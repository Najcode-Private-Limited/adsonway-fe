import { Chrome, ContactIcon, CreditCard, Facebook, FileText, LayoutDashboard, ShoppingCart, Users2, Wallet } from "lucide-react";
import { getItem } from "../local_storage";
const userName = getItem("userName") || "Admin";
const userEmail = getItem("userEmail") || "admin@admin.com";
export const data = {
  user: {
    name: userName,
    email: userEmail,
    avatar: "/user.jpg",
  },

  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
      items: [],
    },
    {
      title: "Admin",
      url: "/dashboard/admins",
      icon: Users2,
      isActive: true,
      items: [],
      roles: ["admin"],
    },
    {
      title: "Agent",
      url: "/dashboard/agents",
      icon: Users2,
      isActive: true,
      items: [],
      roles: ["admin"],
    },
    {
      title: "Payment",
      url: "/dashboard/payment",
      icon: CreditCard,
      isActive: true,
      items: [],
      roles: ["admin"],
    },
    {
      title: "Users",
      url: "/dashboard/users",
      icon: Users2,
      isActive: true,
      items: [],
      roles: ["agent"],
    },
    {
      title: "Agent User",
      url: "/dashboard/agent-users",
      icon: Users2,
      isActive: true,
      items: [],
      roles: ["admin"],
    },
    {
      title: "Wallet",
      url: "/dashboard/wallet",
      icon: Wallet,
      isActive: true,
      items: [],
      roles: ["user"],
    },
    {
      title: "User Topup Request",
      url: "/dashboard/wallet",
      icon: Wallet,
      isActive: true,
      items: [],
      roles: ["admin"],
    },
    {
      title: "Transaction Log",
      url: "/dashboard/transaction-log",
      icon: FileText,
      isActive: true,
      items: [],
      roles: ["admin", "user", "agent"],
    },
    {
      title: "Facebook",
      url: "#",
      icon: Facebook,
      isActive: true,
      items: [
        {
          title: "Ad Application",
          url: "/dashboard/facebook-ad-application",
          icon: FileText,
          roles: ["admin"],
        },
        {
          title: "Ad Accounts",
          url: "/dashboard/facebook-accounts",
          icon: FileText,
          roles: ["admin"],
        },
        {
          title: "Ad Application",
          url: "/dashboard/facebook-ad-application",
          icon: FileText,
          roles: ["user"],
        },
        {
          title: "Ad Accounts",
          url: "/dashboard/my-facebook-accounts",
          icon: FileText,
          roles: ["user"],
        },
        {
          title: "Deposits",
          url: "/dashboard/facebook-deposits",
          icon: FileText,
          roles: ["user"],
        },
      ],
      roles: ["admin", "user"],
    },
    {
      title: "Google",
      url: "#",
      icon: Chrome,
      isActive: true,
      items: [
        {
          title: "Ad Application",
          url: "/dashboard/google-ad-application",
          icon: FileText,
          roles: ["admin"],
        },
        {
          title: "Ad Accounts",
          url: "/dashboard/google-accounts",
          icon: FileText,
          roles: ["admin"],
        },
        {
          title: "Ad Application",
          url: "/dashboard/google-ad-application",
          icon: FileText,
          roles: ["user"],
        },
        {
          title: "Ad Accounts",
          url: "/dashboard/my-google-accounts",
          icon: FileText,
          roles: ["user"],
        },
      ],
      roles: ["admin", "user"],
    },

  ],
  projects: [
    // {
    //   title: "Contact us form",
    //   name: "Contact us form",
    //   url: "/dashboard/contact-us",
    //   icon: ContactIcon,
    //   roles: ["super_admin", "admin"],
    // },
    // {
    //   title: "Info & Policy",
    //   name: "Info & Policy",
    //   url: "/dashboard/info-policy",
    //   icon: BadgeInfo,
    //   roles: ["super_admin", "admin"],
    //   items: [
    //     {
    //       title: "Terms & Conditions",
    //       name: "Terms & Conditions",
    //       url: "/dashboard/info-policy/terms-conditions",
    //     },
    //     {
    //       title: "Privacy Policy",
    //       name: "Privacy Policy",
    //       url: "/dashboard/info-policy/privacy-policy",
    //     },
    //     {
    //       title: "FAQ",
    //       name: "FAQ",
    //       url: "/dashboard/info-policy/faq",
    //     },
    //   ],
    // },
    // {
    //   title: "Testimonial",
    //   name: "Testimonial",
    //   url: "/dashboard/testimonials",
    //   icon: MessageSquarePlus,
    //   roles: ["super_admin", "admin",],
    // },
  ],
};

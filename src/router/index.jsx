import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "@/auth/ProtectedRoute";
import PublicRoute from "@/auth/PublicRoute";
import Login from "@/pages/login";
import Layout from "@/layout";
import Dashboard from "@/pages/dashboard";

import ErrorPage from "@/components/404";

import Blogs from "@/pages/blogs";
import BlogEditor from "@/pages/blogs/components/blog_editor";
import ContactUs from "@/pages/contact_us";
import TopProducts from "@/pages/e-commerce";
import Admin from "@/pages/admin";
import Agent from "@/pages/agent";
import Users from "@/pages/users";
import AgentUsers from "@/pages/agent-users";
import Payment from "@/pages/payment";
import Wallet from "@/pages/wallet";
import TransactionLog from "@/pages/transaction_log";
import GoogleAdApplication from "@/pages/google_ad_application";
import FacebookAdApplication from "@/pages/facebook_ad_application";
import FacebookAccounts from "@/pages/facebook_accounts";
import MyFacebookAccounts from "@/pages/facebook_ad_accounts";
import GoogleAccounts from "@/pages/google_accounts";
import MyGoogleAccounts from "@/pages/google_ad_accounts";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<Dashboard />} />
          {/* Admin & Agent Routes */}
          <Route path="/dashboard/admins" element={<Admin />} />
          <Route path="/dashboard/agents" element={<Agent />} />
          <Route path="/dashboard/users" element={<Users />} />
          <Route path="/dashboard/agent-users" element={<AgentUsers />} />
          <Route path="/dashboard/payment" element={<Payment />} />
          <Route path="/dashboard/wallet" element={<Wallet />} />
          <Route path="/dashboard/transaction-log" element={<TransactionLog />} />
          <Route path="/dashboard/google-ad-application" element={<GoogleAdApplication />} />
          <Route path="/dashboard/google-accounts" element={<GoogleAccounts />} />
          <Route path="/dashboard/my-google-accounts" element={<MyGoogleAccounts />} />
          <Route path="/dashboard/facebook-ad-application" element={<FacebookAdApplication />} />
          <Route path="/dashboard/facebook-accounts" element={<FacebookAccounts />} />
          <Route path="/dashboard/my-facebook-accounts" element={<MyFacebookAccounts />} />
          {/* Blogs */}
          <Route path="/dashboard/blogs" element={<Blogs />} />
          <Route path="/dashboard/blogs/add" element={<BlogEditor />} />
          <Route path="/dashboard/blogs/edit/:id" element={<BlogEditor />} />
          {/* <Route path="/dashboard/blogs/:id" element={<BlogDetails />} /> */}
          <Route path="/dashboard/contact-us" element={<ContactUs />} />
          <Route path="/dashboard/e-commerce" element={<TopProducts />} />
        </Route>
      </Route>
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};

export default Router;

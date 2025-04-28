import React from "react";
import { Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import {
  Add,
  Gig,
  Gigs,
  MyGigs,
  Home,
  Message,
  Messages,
  Orders,
  Login,
  Register,
  Pay,
  Success,
} from "../pages";

import { Navbar, Footer } from "../components";

const Layout = () => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="app">
        <Navbar />
        <Outlet />
        <Footer />
      </div>
    </QueryClientProvider>
  );
};
const Routes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/gigs",
        element: <Gigs />,
      },
      {
        path: "/mygigs",
        element: <MyGigs />,
      },
      {
        path: "/orders",
        element: <Orders />,
      },
      {
        path: "/gig/:id",
        element: <Gig />,
      },
      {
        path: "/messages",
        element: <Messages />,
      },
      {
        path: "/message/:id",
        element: <Message />,
      },
      {
        path: "/add",
        element: <Add />,
      },
      {
        path: "/pay/:id",
        element: <Pay />,
      },
      {
        path: "/success",
        element: <Success />,
      },
    ],
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
];

export default Routes;

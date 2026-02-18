// components/Layout.tsx
import React, { useEffect } from "react";
import { getUsers } from "../utils/User";
import { useUserList } from "../context/UserListContext";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const { dispatch } = useUserList();

  useEffect(() => {
    getUsers((users) => dispatch({ type: "SET_USERS", payload: users }));
  }, []);

  return <>{children}</>;
};

export default Layout;

import { Navigate } from "react-router-dom";
import { ROUTES } from "./constants/routes";

const token = localStorage.getItem("token");
export const PublicGuard = ({ children }: { children: React.ReactNode }) => {
  // if (token) {
  //   return <Navigate to={ROUTES.DASHBOARD} replace />;
  // }
  return (
    <>
      {children}
    </>)
};

export const PrivateGuard = ({ children }: { children: React.ReactNode }) => {

  // if (!token) {
  //   return <Navigate to={ROUTES.LOGIN} replace />;
  // }

  return (
    <>
      {children}
    </>)
};
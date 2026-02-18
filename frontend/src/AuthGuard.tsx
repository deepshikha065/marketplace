import { Navigate } from "react-router-dom";
import { ROUTES } from "./constants/routes";
import { useAppSelector } from "./redux/app/hooks";

export const PublicGuard = ({ children }: { children: React.ReactNode }) => {
  const token = useAppSelector((state) => state.user.token);

  if (token) {
    return <Navigate to={ROUTES.MARKETPLACE} replace />;
  }

  return <>{children}</>;
};

export const PrivateGuard = ({ children }: { children: React.ReactNode }) => {
  const token = useAppSelector((state) => state.user.token);

  if (!token) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <>{children}</>;
};

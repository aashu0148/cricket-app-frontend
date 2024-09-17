import { useSelector } from "react-redux";

import { applicationRoutes } from "@/utils/constants";

function PrivateRoute({ children }) {
  const userDetails = useSelector((state) => state.root.user);

  if (!userDetails._id && window.location.pathname !== applicationRoutes.auth)
    window.location.href = applicationRoutes.auth;

  return children;
}

export default PrivateRoute;

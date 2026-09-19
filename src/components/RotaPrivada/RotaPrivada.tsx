import { Navigate } from "react-router";
import { getDataLocalStorage } from "../../utils/getDataLocalStorage";

interface RotaPrivadaProps {
  children: React.ReactNode;
}

function RotaPrivada({ children }: RotaPrivadaProps) {
  const dadosLocalStorage = getDataLocalStorage();

  if (!dadosLocalStorage) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RotaPrivada;

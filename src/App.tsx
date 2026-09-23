import { Route, Routes, useLocation } from "react-router";
import Menu from "./components/Menu/Menu";
import RotaPrivada from "./components/RotaPrivada/RotaPrivada";
import Login from "./pages/Login/Login";
import Mesas from "./pages/Mesas/Mesas";
import CadastroMesa from "./pages/CadastroMesa/CadastroMesa";
import PedidosItems from "./pages/PedidosItems/PedidosItems";
import Pedidos from "./pages/Pedidos/Pedidos";
import Chefs from "./pages/Chefs/Chefs";
import Cardapio from "./pages/Cardapio/Cardapio";

// const telasNaoMenu = ["/", "/fale-conosco"];

function App() {
  const location = useLocation();

  return (
    <>
      {/* !telasNaoMenu.includes(location.pathname) && <Menu /> */}
      {location.pathname !== "/" && <Menu />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/mesas"
          element={
            <RotaPrivada>
              <Mesas />
            </RotaPrivada>
          }
        />
        <Route
          path="/mesas/nova"
          element={
            <RotaPrivada>
              <CadastroMesa />
            </RotaPrivada>
          }
        />
        <Route
          path="/pedido-items/:id"
          element={
            <RotaPrivada>
              <PedidosItems />
            </RotaPrivada>
          }
        />
        <Route
          path="/pedidos"
          element={
            <RotaPrivada>
              <Pedidos />
            </RotaPrivada>
          }
        />
        <Route
          path="/chefes"
          element={
            <RotaPrivada>
              <Chefs />
            </RotaPrivada>
          }
        />
        <Route
          path="/cardapio/novo"
          element={
            <RotaPrivada>
              <Cardapio />
            </RotaPrivada>
          }
        />
      </Routes>
    </>
  );
}

export default App;

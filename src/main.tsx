import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";

import Login from "./pages/Login/Login";
import Mesas from "./pages/Mesas/Mesas";
import PedidosItems from "./pages/PedidosItems/PedidosItems";
import Pedidos from "./pages/Pedidos/Pedidos";

import "./styles/reset.css";
import "./index.module.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/mesas" element={<Mesas />} />
        <Route path="/pedido-items" element={<PedidosItems />} />
        <Route path="/pedidos" element={<Pedidos />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);

import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import Swal from "sweetalert2";

import styles from "./Login.module.css"; // MODO novo com CSS modules
import stylesIndex from "../../index.module.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Função que vai na api validar se usuario existe

  async function fazerLogin(event: React.SubmitEvent) {
    try {
      event.preventDefault();

      await axios.post("http://localhost:8888/auth/login", {
        email: email,
        senha: password,
      });

      Swal.fire({
        title: "Login realizado com sucesso",
        icon: "success",
      });

      navigate("/mesas");
    } catch (error) {
      Swal.fire({
        title: error.response.data.error,
        icon: "error",
        showConfirmButton: false,
        timer: 3000,
      });
    }
  }

  return (
    <form className={styles.container} onSubmit={fazerLogin}>
      <span className={styles.logo}>🍽️</span>
      <h1 className={styles.nome}>Sabor & Arte</h1>
      <p className={styles.subTitulo}>Acesse o painel do restaurante</p>

      <div className={stylesIndex.containerInput}>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className={stylesIndex.containerInput}>
        <label>Senha</label>
        <input
          type="password"
          placeholder="******"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        ></input>
      </div>

      <button type="submit">Entrar</button>
    </form>
  );
}

export default Login;

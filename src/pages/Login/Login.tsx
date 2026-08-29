import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import Swal from "sweetalert2";

import styles from "./Login.module.css"; // MODO novo com CSS modules
import stylesIndex from "../../index.module.css";
import Loading from "../../components/Loading/Loading";

function Login() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Função que vai na api validar se usuario existe

  async function fazerLogin(event: React.SubmitEvent) {
    try {
      event.preventDefault();

      setLoading(true);

      // atrasar de intencional 2 segundos a execucao da próxima
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const response = await axios.post("http://localhost:8888/auth/login", {
        email: email,
        senha: password,
      });

      // Salva o token no local storage para usarmos depois
      localStorage.setItem("@dadoslogin", JSON.stringify(response.data));

      Swal.fire({
        title: "Login realizado com sucesso",
        icon: "success",
      });

      navigate("/mesas");
    } catch (error) {
      setLoading(false);
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
          placeholder="seuemail@restaurante.com"
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

      <button className={styles.buttonLogin} type="submit">
        {loading ? <Loading /> : "Entrar"}
      </button>
    </form>
  );
}

export default Login;

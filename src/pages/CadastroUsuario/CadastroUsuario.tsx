import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

import styles from "./CadastroUsuario.module.css";
import stylesIndex from "../../index.module.css";
import Header from "../../components/Header/Header";
import Loading from "../../components/Loading/Loading";

import api from "../../services/api";

function CadastroUsuario() {
  const [loading, setLoading] = useState(false);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [role, setRole] = useState("");

  async function cadastrarUsuario(event: React.SubmitEvent) {
    try {
      event.preventDefault();

      setLoading(true);

      await api.post("auth/usuarios", {
        nome: nome,
        email: email,
        senha: senha,
        role: role,
      });

      Swal.fire({
        title: "Usuário cadastrado com sucesso",
        icon: "success",
      });

      setNome("");
      setEmail("");
      setSenha("");
      setRole("");

      setLoading(false);
    } catch (error) {
      setLoading(false);

      const mensagem = axios.isAxiosError(error)
        ? error.response?.data?.error
        : undefined;

      Swal.fire({
        title: mensagem ?? "Erro ao cadastrar usuário",
        icon: "error",
        showConfirmButton: false,
        timer: 3000,
      });
    }
  }

  return (
    <div>
      <Header
        title="Novo Usuário"
        description="Cadastre um novo usuário do sistema"
      />

      <form className={styles.container} onSubmit={cadastrarUsuario}>
        <div className={stylesIndex.containerInput}>
          <label>Nome</label>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex.: João Silva"
            required
          />
        </div>

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
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="******"
            required
          />
        </div>

        <div className={stylesIndex.containerInput}>
          <label>Perfil</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="" disabled>
              Selecione
            </option>
            <option value="admin">Admin</option>
            <option value="chef">Chef</option>
            <option value="gerente">Gerente</option>
            <option value="garcom">Garçom</option>
          </select>
        </div>

        <button className={styles.buttonCadastrar} type="submit">
          {loading ? <Loading /> : "Cadastrar"}
        </button>
      </form>
    </div>
  );
}

export default CadastroUsuario;

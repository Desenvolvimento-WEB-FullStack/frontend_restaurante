import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import Swal from "sweetalert2";

import styles from "./CadastroMesa.module.css";
import stylesIndex from "../../index.module.css";
import Header from "../../components/Header/Header";
import Loading from "../../components/Loading/Loading";
import { getDataLocalStorage } from "../../utils/getDataLocalStorage";

const dadosLocalStorage = getDataLocalStorage();

function CadastroMesa() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [nome, setNome] = useState("");
  const [quantidadeLugares, setQuantidadeLugares] = useState("");

  async function cadastrarMesa(event: React.SubmitEvent) {
    try {
      event.preventDefault();

      setLoading(true);

      await axios.post(
        "http://localhost:8888/mesas",
        {
          nome: nome,
          quantidade_lugares: quantidadeLugares,
        },
        {
          headers: {
            Authorization: `Bearen ${dadosLocalStorage.token}`,
          },
        },
      );

      Swal.fire({
        title: "Mesa cadastrada com sucesso",
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
    <div>
      <Header title="Nova Mesa" description="Cadastre uma nova mesa para o salão" />

      <form className={styles.container} onSubmit={cadastrarMesa}>
        <div className={stylesIndex.containerInput}>
          <label>Nome da mesa</label>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex.: Mesa 1"
            required
          />
        </div>

        <div className={stylesIndex.containerInput}>
          <label>Quantidade de lugares</label>
          <input
            type="number"
            value={quantidadeLugares}
            onChange={(e) => setQuantidadeLugares(e.target.value)}
            placeholder="Ex.: 4"
            required
          />
        </div>

        <button className={styles.buttonCadastrar} type="submit">
          {loading ? <Loading /> : "Cadastrar"}
        </button>
      </form>
    </div>
  );
}

export default CadastroMesa;

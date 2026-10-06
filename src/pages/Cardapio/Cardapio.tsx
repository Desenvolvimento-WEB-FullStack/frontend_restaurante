import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

import styles from "./Cardapio.module.css";
import stylesIndex from "../../index.module.css";
import Header from "../../components/Header/Header";
import Loading from "../../components/Loading/Loading";

import api from "../../services/api";

function Cardapio() {
  const [loading, setLoading] = useState(false);

  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [tipo, setTipo] = useState("");
  const [porcoes, setPorcoes] = useState("");
  const [tamanho, setTamanho] = useState("");
  const [vegetariano, setVegetariano] = useState(false);
  const [descricao, setDescricao] = useState("");

  async function cadastrarCardapio(event: React.SubmitEvent) {
    try {
      event.preventDefault();

      setLoading(true);

      await api.post("items-cardapio", {
        nome: nome,
        preco: Number(preco),
        tipo: tipo,
        porcoes: Number(porcoes),
        tamanho: tamanho,
        vegetariano: vegetariano,
        descricao: descricao,
      });

      Swal.fire({
        title: "Item do cardápio cadastrado com sucesso",
        icon: "success",
      });

      setNome("");
      setPreco("");
      setTipo("");
      setPorcoes("");
      setTamanho("");
      setVegetariano(false);
      setDescricao("");

      setLoading(false);
    } catch (error) {
      setLoading(false);

      const mensagem = axios.isAxiosError(error)
        ? error.response?.data?.error
        : undefined;

      Swal.fire({
        title: mensagem ?? "Erro ao cadastrar item do cardápio",
        icon: "error",
        showConfirmButton: false,
        timer: 3000,
      });
    }
  }

  return (
    <div>
      <Header
        title="Novo Item do Cardápio"
        description="Cadastre um novo item para o cardápio"
      />

      <form className={styles.container} onSubmit={cadastrarCardapio}>
        <div className={stylesIndex.containerInput}>
          <label>Nome</label>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex.: Feijoada"
            required
          />
        </div>

        <div className={stylesIndex.containerInput}>
          <label>Preço</label>
          <input
            type="number"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            placeholder="Ex.: 39.90"
            required
          />
        </div>

        <div className={stylesIndex.containerInput}>
          <label>Tipo</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            required
          >
            <option value="" disabled>
              Selecione
            </option>
            <option value="entrada">Entrada</option>
            <option value="prato_principal">Prato Principal</option>
            <option value="sobremesa">Sobremesa</option>
            <option value="bebida">Bebida</option>
          </select>
        </div>

        <div className={stylesIndex.containerInput}>
          <label>Porções</label>
          <input
            type="number"
            value={porcoes}
            onChange={(e) => setPorcoes(e.target.value)}
            placeholder="Ex.: 2"
            required
          />
        </div>

        <div className={stylesIndex.containerInput}>
          <label>Tamanho</label>
          <select
            value={tamanho}
            onChange={(e) => setTamanho(e.target.value)}
            required
          >
            <option value="" disabled>
              Selecione
            </option>
            <option value="P">P (Pequeno)</option>
            <option value="M">M (Médio)</option>
            <option value="G">G (Grande)</option>
          </select>
        </div>

        <div className={styles.containerCheckbox}>
          <label>
            <input
              type="checkbox"
              checked={vegetariano}
              onChange={(e) => setVegetariano(e.target.checked)}
            />
            Vegetariano
          </label>
        </div>

        <div className={stylesIndex.containerInput}>
          <label>Descrição</label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Descreva o prato..."
          />
        </div>

        <button className={styles.buttonCadastrar} type="submit">
          {loading ? <Loading /> : "Cadastrar"}
        </button>
      </form>
    </div>
  );
}

export default Cardapio;

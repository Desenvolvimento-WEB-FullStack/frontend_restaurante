import axios from "axios";
import { useEffect, useState } from "react";
import { getDataLocalStorage } from "../../utils/getDataLocalStorage";

const dadosLocalStorage = getDataLocalStorage();

type ItemCardapio = {
  id: number;
  nome: string;
  preco: string;
  tipo: string;
  porcoes: number;
  tamanho: "P" | "M" | "G";
  vegetariano: boolean;
  descricao: string | null;
  criado_em: string;
  atualizado_em: string;
};

function PedidosItems() {
  const [itemsCardapio, setItemsCardapio] = useState<ItemCardapio[]>([]);

  async function buscaItemsCardapio() {
    const response = await axios.get<ItemCardapio[]>(
      "http://localhost:8888/items-cardapio",
      {
        headers: {
          Authorization: `Bearer ${dadosLocalStorage.token}`,
        },
      },
    );
    setItemsCardapio(response.data);
  }

  useEffect(() => {
    buscaItemsCardapio();
  }, []); // Deve executar durante a renderização inicial do componente, ou seja, quando o componente for montado na tela.

  return (
    <div>
      {itemsCardapio.map((item) => (
        <div key={item.id}>
          <div>
            <ul>
              <li>Nome: {item.nome}</li>
              <li>Preço: {item.preco}</li>
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PedidosItems;

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { getDataLocalStorage } from "../../utils/getDataLocalStorage";

const dadosLocalStorage = getDataLocalStorage();

type Chef = {
  id: number;
  nome: string;
  faz_sobremesa: boolean;
  especializacao: string;
  criado_em: string;
  atualizado_em: string;
};

function Chefs() {
  const [chefs, setChefs] = useState<Chef[]>([]);

  async function buscarChefs() {
    const response = await axios.get<Chef[]>("http://localhost:8888/chefs", {
      headers: {
        Authorization: `Bearen ${dadosLocalStorage.token}`,
      },
    });

    setChefs(response.data);
  }

  useEffect(() => {
    buscarChefs();
  }, []);

  return (
    <div>
      <h2>Quadro de chefs</h2>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Especialidade</TableCell>
              <TableCell>Faz Sobremesa</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {chefs.map((chef) => (
              <TableRow>
                <TableCell>{chef.criado_em}</TableCell>
                <TableCell>{chef.especializacao}</TableCell>
                <TableCell>
                  {chef.faz_sobremesa ? (
                    <Chip label="SIM" color="success" />
                  ) : (
                    <Chip label="NÃO" color="error" />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Chefs;

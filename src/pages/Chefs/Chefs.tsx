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

import { useEffect, useState } from "react";

import globalStyles from "../../index.module.css";

import api from "../../services/api";
import Header from "../../components/Header/Header";

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
    const response = await api.get<Chef[]>("/chefs");

    setChefs(response.data);
  }

  useEffect(() => {
    buscarChefs();
  }, []);

  return (
    <div className={globalStyles.mainContainer}>
      <Header
        title="Chefes"
        description="Consulte todas os chefes do restaurante"
      />

      <TableContainer component={Paper} style={{ marginTop: 20 }}>
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
                <TableCell>{chef.nome}</TableCell>
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

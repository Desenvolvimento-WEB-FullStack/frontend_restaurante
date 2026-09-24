import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

function formatDate(data: string) {
  const dataFormatada = format(parseISO(data), "dd 'de' MMMM 'de' yyyy ", {
    locale: ptBR,
  });

  return dataFormatada;
}

export default formatDate;

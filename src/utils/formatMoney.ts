export function formatMoney(value: number) {
  const valorFormato = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

  return valorFormato;
}

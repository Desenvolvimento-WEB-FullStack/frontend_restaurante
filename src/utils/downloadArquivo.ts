export async function downloadArquivo(url: string, nomePadrao = "arquivo") {
  try {
    const arquivo = await fetch(url);
    if (!arquivo.ok) throw new Error();

    const blobUrl = URL.createObjectURL(await arquivo.blob());
    const nomeArquivo = new URL(url).pathname.split("/").pop() || nomePadrao;

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = nomeArquivo;
    link.click();
    URL.revokeObjectURL(blobUrl);
  } catch {
    // Sem CORS no bucket o fetch falha; ao menos abre o arquivo em nova aba
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

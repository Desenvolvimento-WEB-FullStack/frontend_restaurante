export function getDataLocalStorage() {
  const dadosLocalStorage = localStorage.getItem("@dadoslogin");

  if (dadosLocalStorage) {
    return JSON.parse(dadosLocalStorage);
  } else {
    return "";
  }
}

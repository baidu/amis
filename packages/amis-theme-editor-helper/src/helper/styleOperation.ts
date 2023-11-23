export function findOrCreactStyle(id: string) {
  let varStyleTag = document.getElementById(id);
  if (!varStyleTag) {
    varStyleTag = document.createElement('style');
    varStyleTag.id = id;
    document.body.appendChild(varStyleTag);
  }
  return varStyleTag;
}

export function insertStyle(style: string, id: string) {
  const varStyleTag = findOrCreactStyle(id);
  // bca-disable-line
  varStyleTag.innerHTML = style;
}

export function addStyle(style: string, id: string) {
  const varStyleTag = findOrCreactStyle(id);
  // bca-disable-line
  varStyleTag.innerHTML += style;
}

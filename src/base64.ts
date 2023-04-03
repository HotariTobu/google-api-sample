export const encode = function(str: string) {
  return btoa([...new TextEncoder().encode(str)].map((b) => String.fromCharCode(b)).join(""));
}

export const decode = function(str: string) {
  return new TextDecoder().decode(Uint8Array.from(atob(str), (c) => c.charCodeAt(0)));
}
export const formatName = (name: string) => {
  const palabras = name.split(' ')
  const palabrasCapitalizadas = palabras.map(
    (palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase()
  )
  const nombreFormateado = palabrasCapitalizadas.join(' ')
  return nombreFormateado
}

export const formatToMoney = (number: string): string => {
  let numberStr = number;
  
  let parts = numberStr.split(',');
  
  let integerPart = parts[0];
  let formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  
  if (parts.length > 1) {
      return `$${formattedIntegerPart},${parts[1]}`;
  } else {
      return `$${formattedIntegerPart}`;
  }
}

export function getContrastColor(hexColor) {
  if (hexColor === "#00000000") return "#000"
  let r = parseInt(hexColor.substr(1, 2), 16);
  let g = parseInt(hexColor.substr(3, 2), 16);
  let b = parseInt(hexColor.substr(5, 2), 16);

  let luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? "#000" : "#fff";
}
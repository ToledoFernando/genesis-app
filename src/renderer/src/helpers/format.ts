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
export const formatName = (name: string) => {
  const palabras = name.split(' ')
  const palabrasCapitalizadas = palabras.map(
    (palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase()
  )
  const nombreFormateado = palabrasCapitalizadas.join(' ')
  return nombreFormateado
}
export const formatTime = (time: number) => {
  let fecha: Date;
  fecha = new Date(time);

  const dia = fecha.getDate().toString().padStart(2, "0"); // Asegura dos dígitos en el día
  const mes = (fecha.getMonth() + 1).toString().padStart(2, "0"); // Asegura dos dígitos en el mes
  const año = fecha.getFullYear();
  let hora = fecha.getHours();
  const minutos = fecha.getMinutes().toString().padStart(2, "0"); // Asegura dos dígitos en los minutos
  const AM_PM = hora >= 12 ? "PM" : "AM";
  hora = Number(hora.toString().padStart(2, "0"));

  return { fecha: `${dia}/${mes}/${año}`, Hora: `${hora}:${minutos} ${AM_PM}` };
}
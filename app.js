// Rango de valores viáticos por región
const VIATICOS = {
  'america': 65,
  'nueva_york': 70,
  'europa': 80,
  'asia': 85,
  'africa': 85,
  'oceania': 85,
  'pascua': 85
};

// Construir tabla de días
window.onload = () => {
  const tbody = document.getElementById("tablaDias");
  for (let i = 1; i <= 31; i++) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${i}</td>
      <td><input type="text" class="vuelo" /></td>
      <td><input type="text" class="ruta" /></td>
      <td><input type="text" class="destino" /></td>
      <td><input type="checkbox" class="turno" /></td>
      <td><input type="checkbox" class="noche" /></td>
      <td><input type="checkbox" class="feriado" /></td>
      <td><input type="number" step="0.1" class="pax" /></td>
      <td><input type="number" step="0.1" class="block" /></td>
      <td><input type="number" step="0.01" class="lavandero" /></td>
      <td><input type="number" step="0.01" class="movilizacion" /></td>
    `;
    tbody.appendChild(row);
  }
};

function calcularViatico(destino) {
  if (!destino) return 0;
  destino = destino.toLowerCase();
  if (destino.includes("nueva york")) return VIATICOS.nueva_york;
  if (destino.includes("europa")) return VIATICOS.europa;
  if (destino.includes("africa")) return VIATICOS.africa;
  if (destino.includes("asia")) return VIATICOS.asia;
  if (destino.includes("oceania") || destino.includes("pascua")) return VIATICOS.oceania;
  return VIATICOS.america;
}

function calcularTotales() {
  const sueldoBase = parseFloat(document.getElementById("sueldoBase").value) || 0;
  const horasProgramadas = parseFloat(document.getElementById("horasProgramadas").value) || 0;

  let totalPAX = 0, totalBlock = 0, totalTurnos = 0, totalFeriados = 0;
  let totalViaticos = 0, totalExtras = 0;

  document.querySelectorAll("#tablaDias tr").forEach(row => {
    const destino = row.querySelector(".destino").value;
    const pax = parseFloat(row.querySelector(".pax").value) || 0;
    const block = parseFloat(row.querySelector(".block").value) || 0;
    const lav = parseFloat(row.querySelector(".lavandero").value) || 0;
    const mov = parseFloat(row.querySelector(".movilizacion").value) || 0;
    const turno = row.querySelector(".turno").checked;
    const feriado = row.querySelector(".feriado").checked;

    totalPAX += pax;
    totalBlock += block;
    if (turno) totalTurnos++;
    if (feriado) totalFeriados++;
    totalViaticos += calcularViatico(destino);
    totalExtras += lav + mov;
  });

  const horasReales = totalBlock + totalPAX * 0.5;
  const horasValidas = Math.max(horasReales, horasProgramadas);

  const bonusTurno = totalTurnos > 3 ? sueldoBase * 0.025 : 0;
  const bonusFeriados = totalFeriados * sueldoBase * 0.066;

  // TODO: Calcular componente variable según tabla externa
  const componenteVariable = 0;

  const totalVariable = componenteVariable + bonusTurno + bonusFeriados + totalExtras;

  document.getElementById("horasReales").textContent = horasReales.toFixed(2);
  document.getElementById("horasValidas").textContent = horasValidas.toFixed(2);
  document.getElementById("totalViaticos").textContent = "$" + totalViaticos.toFixed(0);
  document.getElementById("totalTurnos").textContent = totalTurnos;
  document.getElementById("totalFeriados").textContent = totalFeriados;
  document.getElementById("bonusTurno").textContent = "$" + bonusTurno.toFixed(0);
  document.getElementById("bonusFeriados").textContent = "$" + bonusFeriados.toFixed(0);
  document.getElementById("totalExtras").textContent = "$" + totalExtras.toFixed(0);
  document.getElementById("totalVariable").textContent = "$" + totalVariable.toFixed(0);
}

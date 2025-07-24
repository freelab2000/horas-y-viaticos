const tarifas = {
  capitan: {
    nivel_a: [0, 0, 0, 0, 500, 600, 700, 800],
    nivel_b: [0, 0, 0, 0, 450, 550, 650, 750],
    nivel_c: [0, 0, 0, 0, 400, 500, 600, 700]
  },
  primer_oficial: {
    nivel_a: [0, 0, 0, 0, 300, 400, 500, 600],
    nivel_b: [0, 0, 0, 0, 250, 350, 450, 550],
    nivel_c: [0, 0, 0, 0, 200, 300, 400, 500]
  },
  sub_c: {
    "0_nivel1": [0, 0, 0, 0, 150, 200, 250, 300],
    "1_nivel2": [0, 0, 0, 0, 180, 230, 280, 330],
    "2_nivel3": [0, 0, 0, 0, 210, 260, 310, 360],
    "3_nivel3": [0, 0, 0, 0, 240, 290, 340, 390]
  }
};

function tramoHoras(horas) {
  if (horas < 59) return 0;
  if (horas < 69) return 4;
  if (horas < 79) return 5;
  if (horas < 89) return 6;
  return 7;
}

window.onload = () => {
  const tbody = document.getElementById("tablaDias");
  for (let i = 1; i <= 31; i++) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${i}</td>
      <td><input type="text" class="vuelo" /></td>
      <td><input type="text" class="ruta" /></td>
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

function calcularTotales() {
  const sueldoBase = parseFloat(document.getElementById("sueldoBase").value) || 0;
  const horasProgramadas = parseFloat(document.getElementById("horasProgramadas").value) || 0;
  const cargo = document.getElementById("cargo").value;
  const nivel = document.getElementById("nivel").value;

  let totalPAX = 0, totalBlock = 0, totalTurnos = 0, totalFeriados = 0;
  let totalExtras = 0;

  document.querySelectorAll("#tablaDias tr").forEach(row => {
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
    totalExtras += lav + mov;
  });

  const horasReales = totalBlock + totalPAX * 0.5;
  const horasValidas = Math.max(horasReales, horasProgramadas);
  const tramo = tramoHoras(horasValidas);

  let componenteVariable = 0;
  try {
    if (tarifas[cargo] && tarifas[cargo][nivel]) {
      componenteVariable = tarifas[cargo][nivel][tramo] || 0;
    }
  } catch (e) {
    componenteVariable = 0;
  }

  const bonusTurno = totalTurnos > 3 ? sueldoBase * 0.025 : 0;
  const bonusFeriados = totalFeriados * sueldoBase * 0.066;
  const totalVariable = componenteVariable + bonusTurno + bonusFeriados + totalExtras;

  document.getElementById("horasReales").textContent = horasReales.toFixed(2);
  document.getElementById("horasValidas").textContent = horasValidas.toFixed(2);
  document.getElementById("totalViaticos").textContent = "$0";
  document.getElementById("totalTurnos").textContent = totalTurnos;
  document.getElementById("totalFeriados").textContent = totalFeriados;
  document.getElementById("bonusTurno").textContent = "$" + bonusTurno.toFixed(0);
  document.getElementById("bonusFeriados").textContent = "$" + bonusFeriados.toFixed(0);
  document.getElementById("totalExtras").textContent = "$" + totalExtras.toFixed(0);
  document.getElementById("componenteVariable").textContent = "$" + componenteVariable.toFixed(0);
  document.getElementById("totalVariable").textContent = "$" + totalVariable.toFixed(0);
}

//Global variables
var responseGPT;
var responseGPT2;
//Merge Sort
function mergeSort(array) {
  if (array.length <= 1) {
    return array;
  }
  const midIndex = Math.floor(array.length / 2);
  const leftHalf = array.slice(0, midIndex);
  const rightHalf = array.slice(midIndex);
  const sortedLeftHalf = mergeSort(leftHalf);
  const sortedRightHalf = mergeSort(rightHalf);
  const mergedArray = [];
  let leftIndex = 0;
  let rightIndex = 0;
  while (
    leftIndex < sortedLeftHalf.length &&
    rightIndex < sortedRightHalf.length
  ) {
    if (sortedLeftHalf[leftIndex][1] > sortedRightHalf[rightIndex][1]) {
      mergedArray.push(sortedLeftHalf[leftIndex]);
      leftIndex++;
    } else {
      mergedArray.push(sortedRightHalf[rightIndex]);
      rightIndex++;
    }
  }
  return mergedArray
    .concat(sortedLeftHalf.slice(leftIndex))
    .concat(sortedRightHalf.slice(rightIndex));
}

//SLEEP funcion
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}
async function espera() {
  await sleep(6000); // Espera durante 2000 milisegundos (2 segundos)
}

//RULETA
window.addEventListener("DOMContentLoaded", async function () {
  //RECOGER DATOS API
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      "x-api-key": "txTEkXYw5waU0nGYj96ZgafEMDor0jA4ErqB7m74",
      Authorization:
        "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InhMQVRvOWM2T3VQci1jWEdqMEc3UiJ9.eyJpc3MiOiJodHRwczovL3N0cmFuZHMtZGVtby1iYW5rLmV1LmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHx1c2VyUEZNNCIsImF1ZCI6Imh0dHA6Ly9zYW5kYm94LnN0cmFuZHNjbG91ZC5jb20vIiwiaWF0IjoxNjgzNzk2NzkxLCJleHAiOjE2ODQyMjg3OTEsImF6cCI6Im1EblhqMHRMM1lYRU5WV21DY05DbEpQbmVXaWh6eUhsIiwiZ3R5IjoicGFzc3dvcmQifQ.mA6oJFjWPBPkcExK-qUoIyvEqJF98yHSKQ-akMYs-FSQaCUkk3AnCV-0q7ZmeBb1L_11likmc7AhhNPZqg6Yir_jMnIob3HsUYcN-YJs4oxgWQjgvxV4d3lUmjji_yq52VHdJY7MIWfBjj3sogQnBAGft1n5JWFXRJrAbqrrkmHGj0OzpL_ggp3F_x7omeyguKfKRonH9UbnCK3f-mO2bat7JyUDx8BAuOHJMY9TTRgOY-7Le8A2cvmfb6spN7wgo0i9C23onmY7RK-03138N68kUWynJqlkmDazEOj1DX8TXdxQWgPMx2MK7gGuQpej9pO-0Yq4moyHkWX17Dh44A",
    },
  };

  //DECLARAR MAPA
  let map = new Map();
  try {
    var response = await fetch(
      "https://int.strandscloud.com/fs-api/transactions?recoverHeatLevel=false&page=0&size=50&sort=DATE_DESC&applyToSplits=false",
      options
    );
  } catch (err) {
    console.error(err);
  }
  
  response = await response.json();
  for (let i = 0; i < response.numberOfElements; ++i) {
    if (map[response.transactions[i].category.id] !== undefined) {
      map.set(response.transactions[i].category.id, 1);
    } else {
      map.set(
        response.transactions[i].category.id,
        1 + response.transactions[i].category.id
      );
    }
  }
  //ORDENAR MAPA
  let id_transaction = [...map];
  id_transaction = mergeSort(id_transaction);
  //ENCONTRAR CATEGORIAS
  let category = [];
  for (let i = 0; i < id_transaction.length; ++i) {
    try {
      var response2 = await fetch(
        "https://int.strandscloud.com/fs-api/categories/" +
          id_transaction[i][0],
        options
      );
    } catch (err) {
      console.error(err);
    }
    response2 = await response2.json();
    category.push(response2.name);
  }

  console.log(category);
  //SUMATORIO DE BALANCE
  try {
    var response3 = await fetch(
      "https://int.strandscloud.com/fs-api/products/balances?timeInterval=MONTH&page=0&size=50&sort=FROM_DATE_DESC&expand=PRODUCT&groupBy=PRODUCT",
      options
    );
  }
  catch (err) {
      console.error(err);
  } 
  response3 = await response3.json();
  console.log(response3);
  let dinero_total = response3.balances[0].closingBalance.amount;
  var balance = 0.02 * dinero_total;
  var balance2 = 0.0015 * dinero_total;
  console.log(balance);
  console.log(balance2);

  if (balance < 25) balance = 25;
  if (balance2 < 10) balance = 10;

  if (category.length < 2) category.push(category[0]);

  //OPENAI
  const prompt = `You will be given a category name between <> and n between /. Your task is to find the best possible purchase you can make related to that category with a budget of at most n dollars. Your output will be only one word, which is the complete name of the purchase. Input: <${category[0]}> /${balance}/`;
  const prompt2 = `You will be given a category name between <> and n between /. Your task is to find the best possible purchase you can make related to that category with a budget of at most n dollars. Your output will be only one word, which is the complete name of the purchase. Input: <${category[1]}> /${balance2}/`;
  const api_key = "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"; // Reemplaza esto con tu propia clave API
  const url = "https://api.openai.com/v1/chat/completions";
  const optionsGPT = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${api_key}`,
    },
    body: JSON.stringify({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      max_tokens: 100,
      n: 1,
      stop: "\n",
      temperature: 0.7,
    }),
  };
  const optionsGPT2 = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${api_key}`,
    },
    body: JSON.stringify({
      messages: [{ role: "user", content: prompt2 }],
      model: "gpt-3.5-turbo",
      max_tokens: 100,
      n: 1,
      stop: "\n",
      temperature: 0.7,
    }),
  };
  
  //Don't discomment until production
  try {
    responseGPT = await fetch(url, optionsGPT);
    responseGPT2 = await fetch(url, optionsGPT2);
  } catch (err) {
    console.error(err);
  }

  responseGPT = await responseGPT.json();
  responseGPT2 = await responseGPT2.json();
  console.log(responseGPT);
  console.log(category[0]);
  console.log(responseGPT2);
  console.log(category[1]);
  console.log(responseGPT.choices[0].message.content);
  console.log(responseGPT2.choices[0].message.content);

  //RULETA
  var tamanyoRuleta = 360;
  var numeroCasillas = 10;
  var anguloCasillas = 360 / numeroCasillas;
  var grados = (180 - anguloCasillas) / 2;
  var alturaCasilla = Math.tan((grados * Math.PI) / 180) * (tamanyoRuleta / 2);
  var ruleta = document.querySelector(".ruleta");
  ruleta.style.width = tamanyoRuleta + "px";
  ruleta.style.height = tamanyoRuleta + "px";
  var style = document.createElement("style");
  style.setAttribute("id", "afterNumero");
  var head = document.querySelector("head");
  head.appendChild(style);
  for (var i = 1; i <= numeroCasillas; i++) {
    var opcion = document.createElement("div");
    opcion.classList.add("opcion");
    opcion.classList.add("opcion-" + i);
    ruleta.appendChild(opcion);
    var clasS = ".opcion-" + i;
    var opcion_i = document.querySelector(clasS);
    if (anguloCasillas * i != 360)
      opcion_i.style.transform = "rotate(" + anguloCasillas * i + "deg)";
    if (i % 2) {
      opcion_i.style.borderBottomColor = "#FFFFFF";
      var afterNumero = document.querySelector("#afterNumero");
      afterNumero.innerHTML +=
      ".opcion-" + i + "::before {content: '" + "standard" + "'}";
    } else if (i == numeroCasillas) {
      opcion_i.style.borderBottomColor = "#FFD700";
      afterNumero.innerHTML +=
        ".opcion-" + i + "::before {content: '" + "jackpot" + "'}";
      var afterNumero = document.querySelector("#afterNumero");
    } else {
      opcion_i.style.borderBottomColor = "#33CC99";
      afterNumero.innerHTML +=
        ".opcion-" + i + "::before {content: '" + "prize" + "'}";
      var afterNumero = document.querySelector("#afterNumero");
    }
    opcion.dataset.content = i;
    opcion.dataset.ancho = tamanyoRuleta / 2 + "px";
    opcion.dataset.line = tamanyoRuleta / 2 + "px";
  }
  var opciones = document.querySelectorAll(".opcion");
  opciones.forEach(function (opcion) {
    opcion.style.borderBottomWidth = alturaCasilla + "px";
    opcion.style.borderRightWidth = tamanyoRuleta / 2 + "px";
    opcion.style.borderLeftWidth = tamanyoRuleta / 2 + "px";
  });

  //POP UP
  ruleta.addEventListener("click", async function () {
    var num;
    var numID = "number-";
    num = 1 + Math.round(Math.random() * (numeroCasillas - 1));
    numID += num;
    var animacionRuleta = document.querySelector("#animacionRuleta");
    if (animacionRuleta) {
      animacionRuleta.remove();
    }
    var style = document.createElement("style");
    style.setAttribute("id", "animacionRuleta");
    style.innerHTML =
      "#number-" +
      num +
      " { animation-name: number-" +
      num +
      "; } " +
      "@keyframes number-" +
      num +
      " {" +
      "from { transform: rotate(0); } " +
      "to { transform: rotate(" +
      (360 * (numeroCasillas - 1) - anguloCasillas * num) +
      "deg); }" +
      "}";
    head.appendChild(style);
    ruleta.removeAttribute("id");
    ruleta.setAttribute("id", numID);
    console.log(numID);
    try {
      await espera();
    } catch (error) {
      console.log(error);
    }
    var popupResultado = document.getElementById("popupResultado");
    var resultadoSlot = document.getElementById("resultadoSlot");
    /* resultadoSlot.textContent = responseGPT.choices[0].message.content; */
    popupResultado.style.display = "flex";
    if (num === numeroCasillas) {
      popupResultado.style.backgroundColor = "#FFD700";
      resultadoSlot.textContent = responseGPT.choices[0].message.content;
    }
    else if (num%2 === 0) {
      popupResultado.style.backgroundColor =  "#33CC99";
      resultadoSlot.textContent = responseGPT2.choices[0].message.content;
    }
    else {
      popupResultado.style.backgroundColor =  "#FFFFFF";
      resultadoSlot.textContent = "0€";
    }
    // botón "Cerrar"
    var cerrarPopup = document.getElementById("cerrarPopup");
    cerrarPopup.addEventListener("click", function () {
      popupResultado.style.display = "none";
    });
  });
});

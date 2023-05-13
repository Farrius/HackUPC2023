function mergeSort(array) {
  // Base case: If the array is empty or has only one element, it is already sorted
  if (array.length <= 1) {
    return array;
  } // Split the array into two halves
  const midIndex = Math.floor(array.length / 2);
  const leftHalf = array.slice(0, midIndex);
  const rightHalf = array.slice(midIndex); // Recursively sort each half
  const sortedLeftHalf = mergeSort(leftHalf);
  const sortedRightHalf = mergeSort(rightHalf); // Merge the sorted halves
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
  } // Append any remaining elements from the left or right half
  return mergedArray
    .concat(sortedLeftHalf.slice(leftIndex))
    .concat(sortedRightHalf.slice(rightIndex));
}

//javascript para la ruleta
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

  let id_transaction = [...map];
  id_transaction = mergeSort(id_transaction);

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

  //PARTE RULETA
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
    opcion_i.style.borderBottomColor = i % 2 ? "#40BCA7" : "#FFFFFF";
    var afterNumero = document.querySelector("#afterNumero");
    afterNumero.innerHTML += ".opcion-" + i + "::before {content: '" + i + "'}";
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
  ruleta.addEventListener("click", function () {
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
  });
});

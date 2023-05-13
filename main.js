window.addEventListener("DOMContentLoaded", function () {
  var tamanyoRuleta = 360;
  var numeroCasillas = 12;
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
    opcion_i.style.transform = "rotate(" + anguloCasillas * i + "deg)";
    opcion_i.style.borderBottomColor = (i%2 ? "#40BCA7" : "#FFFFFF");

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

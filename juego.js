'use strict';

//Asignamando variables a los elementos a utilizar
const campoNombreJugador = document.getElementById('nombre-jugador');
const botonIngresarNombre = document.getElementById('ingresar-nombre');
const mensajeJugador = document.getElementById('mensaje-para-jugador');
const campoNumero = document.getElementById('elegir-numero');
const botonIngresarNumero = document.getElementById('ingresar-numero');
const mensajeJugando = document.getElementById('mensaje-para-jugador2');
const botonComienzo = document.getElementById('iniciar-juego');
const botonReinicio = document.getElementById('reiniciar-juego');
const intentosRestantes = document.getElementById('intentos-restantes');
const divTablaPuntajes = document.getElementById('tabla=puntajes');
const mejoresJugadores = document.getElementById('mejores-jugadores');

//Definiendo un array de objetos con el nombre y el puntaje mas alto del jugador
const listaJugadores = [
  { nombre: 'LAR', puntajeMasAlto: 1 },
  { nombre: 'LuAL', puntajeMasAlto: 4 },
  { nombre: 'Kevin93', puntajeMasAlto: 5 },
];

//Clase para creer un nuevo jugador
class Jugador {
  constructor(nombre) {
    this.nombre = nombre;
    this.puntajeMasAlto = 6;
  }
}
//Definiendo variables globales
let numeroSecreto;
let numeroElegido;
let nombreJugador = '';
let intentos;

//funcion para ocultar elementos del log in del jugador, y mostrando boton de comienzo
function ocultarLogin() {
  campoNombreJugador.classList.add('hidden');
  botonIngresarNombre.classList.add('hidden');
  botonComienzo.classList.remove('hidden');
}

//funcion para ocultar elementos del juego
function ocultarInput() {
  botonIngresarNumero.classList.add('hidden');
  campoNumero.classList.add('hidden');
  intentosRestantes.classList.add('hidden');
  botonReinicio.classList.remove('hidden');
}

//funcion para encontrar un jugador en el array
function existeJugador(nombreJugador) {
  return listaJugadores.find((jugador) => {
    console.log(`Compare: ${jugador.nombre}, ${nombreJugador}`);
    return jugador.nombre === nombreJugador;
  });
}

//Funcion que genera el numero secreto y log in del jugador.
function loginJugador() {
  //Mensaje Bienvenida
  mensajeJugador.textContent = 'Hola! Para continuar ingresa tu nombre o apodo';

  //tuve que investigar esto, tenia un error raro donde se ejectutaban multiples loginjugador sin el remove antes.
  botonIngresarNombre.removeEventListener('click', datosJugador);
  botonIngresarNombre.addEventListener('click', datosJugador);

  function datosJugador() {
    nombreJugador = campoNombreJugador.value.trim();
    //Verificando que nombre de jugador no quede vacia
    if (!nombreJugador) {
      mensajeJugador.textContent = 'No ingresaste un nombre, proba devuelta...';
    } else {
      //Verificando si el jugador existe en el array
      const jugadorExistente = existeJugador(nombreJugador);
      console.log(`jugador existente: ${JSON.stringify(jugadorExistente)}`);
      //Condicion en caso que el jugador existe o no y mensajes correspondiente.
      if (!jugadorExistente) {
        const nuevoJugador = new Jugador(nombreJugador);

        //Agregando al nuevo jugador al array
        listaJugadores.push(nuevoJugador);
        mensajeJugador.textContent = `Hola ${nombreJugador} vamos a jugar, que tengas suerte!`;
        console.log(listaJugadores);
        //Oculando los elementos del Login
        ocultarLogin();
      } else {
        mensajeJugador.textContent = `Queres mejorar tu puntaje ${nombreJugador}? dale volvamos a jugar!`;
        ocultarLogin();
      }
    }
    console.log(nombreJugador);
  }
}

botonComienzo.addEventListener('click', function () {
  condicionesIniciales();
});

function condicionesIniciales() {
  //Asignando el valor a intentos
  intentos = 0;
  numeroSecreto = Math.trunc(Math.random() * 30) + 1;
  //** Importante ** Para probar mas facil y hacer trampa activar la linea de abajo
  //alert(`El numero secreto es ${numeroSecreto}`);
  botonComienzo.classList.add('hidden');
  mensajeJugador.classList.add('hidden');
  campoNumero.classList.remove('hidden');
  botonIngresarNumero.classList.remove('hidden');
  mensajeJugando.classList.remove('hidden');
  mensajeJugando.textContent = `${nombreJugador} Ingresa un numero con un valor entre 1 y 30`;
}

botonIngresarNumero.addEventListener('click', function () {
  intentos++;

  numeroElegido = parseInt(campoNumero.value);

  intentosRestantes.classList.remove('hidden');
  intentosRestantes.textContent = `Tenes ${5 - intentos} intentos mas.`;

  //Chequeando si el dato ingresado es un numero.
  if (
    isNaN(numeroElegido) ||
    numeroElegido > 30 ||
    numeroElegido < 1 ||
    !numeroElegido
  ) {
    mensajeJugando.textContent =
      'No ingresaste un numero valido, volve a empezar';
    ocultarInput();
    reiniciarJuego();

    //Condiciones para ganar/perder el juegoy mensajes dinamicos.
  } else if (numeroElegido === numeroSecreto && intentos === 1) {
    mensajeJugando.textContent = 'GANASTE! Le pegaste de una, es increible!';
    puntajeGanador();
    puntajesMasaltos();
    ocultarInput();
    reiniciarJuego();
  } else if (numeroElegido === numeroSecreto && intentos < 6) {
    mensajeJugando.textContent = `Ganaste ${nombreJugador}! adivinaste en  ${intentos} intentos.`;
    puntajeGanador();
    puntajesMasaltos();
    ocultarInput();
    reiniciarJuego();
  } else if (intentos < 5 && numeroElegido < numeroSecreto) {
    mensajeJugando.textContent = `No no, ${nombreJugador} es un numero mas alto!`;
  } else if (intentos < 5 && numeroElegido > numeroSecreto) {
    mensajeJugando.textContent = `Te pasaste ${nombreJugador} es un numero menor!`;
  } else if (intentos === 5 && numeroElegido != numeroSecreto) {
    mensajeJugando.textContent = `Perdiste, se te acabaron los intentos, el numero secreto era: ${numeroSecreto}!`;
    puntajesMasaltos();
    ocultarInput();
    reiniciarJuego();
  }
});

//funcion que cambia elpuntaje mas alto si es mejorado.
function puntajeGanador() {
  const jugadorExistente = existeJugador(nombreJugador);
  if (jugadorExistente.puntajeMasAlto >= intentos) {
    jugadorExistente.puntajeMasAlto = intentos;
  }
}

//Funcion para la creacion de la tabla de mejores jugadores
function puntajesMasaltos() {
  divTablaPuntajes.classList.remove('hidden');

  //Reseteando el contenido de la table.
  mejoresJugadores.innerHTML = '';

  //Al array de jugadores le aplicamos:
  //Sort para ordenar por puntaje ascendiente
  //Slice para dejar solo los primero 5 elementos en caso de que el array tenga mas de 5 jugadores.
  //for each para crear un elemento lista con cada jugador.
  const jugadoresPorPuntaje = listaJugadores
    .sort((a, b) => a.puntajeMasAlto - b.puntajeMasAlto)
    .slice(0, 5)
    .forEach((jugador) => {
      if (jugador.puntajeMasAlto <= 5) {
        const nuevaLista = document.createElement('li');
        nuevaLista.textContent = `${jugador.nombre} acerto en ${jugador.puntajeMasAlto} intentos`;
        mejoresJugadores.appendChild(nuevaLista);
      }
    });
  //console.log(JSON.stringify(jugadoresPorPuntaje));
}

//Funcion de reseteo, reiniciar condiciones iniciales.
function reiniciarJuego() {
  botonReinicio.addEventListener('click', function () {
    botonReinicio.classList.add('hidden');
    mensajeJugando.classList.add('hidden');
    mensajeJugador.classList.remove('hidden');
    campoNombreJugador.classList.remove('hidden');
    botonIngresarNombre.classList.remove('hidden');
    divTablaPuntajes.classList.add('hidden');
  });
}

loginJugador();

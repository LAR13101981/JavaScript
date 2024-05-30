'use strict';
//Se agrego la libreria toastify para reemplzar algunos de los mensajes.
//Se modificaron los mensajes estaticos para que tenga sentido con los mensajes de la libreria.
//Se vacia el campo donde se ingresa el nombre del jugador al reiniciar.
//Se sumo la funcion asincronica de carga datos con fetch de un archivo data.json local en caso de que no haya datos en local storage(EL inicio del juego)
//Se agrego a la funcion de guardado en local storage un display en consola del array de jugadores actualizado.

//Asignando variables a los elementos a utilizar
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

//Clase jugador
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
let listaJugadores = [];

//Funcion de carga de datos de jugadores, chequea si hay datos en local storage y sino corre la funcion que hace fetch desde el archivo data.json.
async function cargaLocalStorage() {
  const datosGuardados = localStorage.getItem('listaJugadores');
  listaJugadores = datosGuardados
    ? JSON.parse(datosGuardados)
    : await cargaJugadores();
}

//Funcion asincronica de carga de array de jugadores(solo lo hace la primera vez que se corre el juego ya que no hay datos en localstorage)
async function cargaJugadores() {
  try {
    const response = await fetch('data.json');
    if (!response.ok) throw new Error('Error al cargar los jugadores');
    const datos = await response.json();
    console.log(datos);
    return datos;
  } catch (error) {
    console.error(error);
  }
}

//Funcion asincronica de guardado de array de jugadores en local storage y display por consola.
async function guardadoJugadores() {
  console.log('Saving data:', JSON.stringify(listaJugadores));
  localStorage.setItem('listaJugadores', JSON.stringify(listaJugadores));
}

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

  cargaLocalStorage();

  //tuve que investigar esto, tenia un bug por el event listener despues de reinciar el juego.
  botonIngresarNombre.removeEventListener('click', datosJugador);

  botonIngresarNombre.addEventListener('click', datosJugador);

  botonComienzo.addEventListener('click', function () {
    condicionesIniciales();
  });

  function datosJugador() {
    nombreJugador = campoNombreJugador.value.trim();
    //Verificando que nombre de jugador no quede vacia
    if (!nombreJugador) {
      Toastify({
        text: 'No ingresaste un nombre, proba devuelta...',
        duration: 3000,
        gravity: 'top',
        position: 'center',
        style: {
          background: 'linear-gradient(to right, #d85d5d, #fa2a2a)',
        },
        className: 'custom-toast',
      }).showToast();
      //mensajeJugador.textContent = 'No ingresaste un nombre, proba devuelta...';
    } else {
      //Verificando si el jugador existe en el array
      const jugadorExistente = existeJugador(nombreJugador);
      console.log(`jugador existente: ${JSON.stringify(jugadorExistente)}`);
      //Condicion en caso que el jugador existe o no y mensajes correspondiente.
      if (!jugadorExistente) {
        const nuevoJugador = new Jugador(nombreJugador);

        //Agregando al nuevo jugador al array
        listaJugadores.push(nuevoJugador);
        Toastify({
          text: `Hola ${nombreJugador} vamos a jugar, que tengas suerte!`,
          duration: 3000,
          gravity: 'top',
          position: 'center',
          style: {
            background: 'linear-gradient(to right, #28a745, #218838)',
          },
          className: 'custom-toast',
        }).showToast();
        mensajeJugador.textContent = ``;
        guardadoJugadores('jugadores', listaJugadores);
        console.log(listaJugadores);
        //Oculando los elementos del Login
        ocultarLogin();
      } else {
        Toastify({
          text: `Queres mejorar tu puntaje ${nombreJugador}? dale volvamos a jugar!`,
          duration: 3000,
          gravity: 'top',
          position: 'center',
          style: {
            background: 'linear-gradient(to right, #17a2b8, #117a8b)',
          },
          className: 'custom-toast',
        }).showToast();
        mensajeJugador.textContent = `Presiona Comenzar para continuar!`;
        ocultarLogin();
      }
    }
    console.log(nombreJugador);
  }
}

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

  //Reseteando el contenido de la tabla.
  mejoresJugadores.innerHTML = '';

  //Al array de jugadores le aplique:
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
}

//Funcion de reseteo, reiniciar condiciones iniciales.
function reiniciarJuego() {
  botonReinicio.addEventListener('click', function () {
    botonReinicio.classList.add('hidden');
    mensajeJugando.classList.add('hidden');
    mensajeJugador.classList.remove('hidden');
    mensajeJugador.textContent = 'Volve a ingresar tu nombre o apodo';
    campoNombreJugador.classList.remove('hidden');
    campoNombreJugador.value = '';
    botonIngresarNombre.classList.remove('hidden');
    divTablaPuntajes.classList.add('hidden');
  });
}

//Evento que se ejecuta al efectuar el ingreso del numero
botonIngresarNumero.addEventListener('click', function () {
  intentos++;

  numeroElegido = parseInt(campoNumero.value);

  intentosRestantes.classList.remove('hidden');
  intentosRestantes.textContent = `Tenes ${5 - intentos} intentos mas.`;

  campoNumero.value = '';

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
    guardadoJugadores('jugadores', listaJugadores);
    puntajesMasaltos();
    ocultarInput();
    reiniciarJuego();
  } else if (numeroElegido === numeroSecreto && intentos < 6) {
    mensajeJugando.textContent = `Ganaste ${nombreJugador}! adivinaste en  ${intentos} intentos.`;
    puntajeGanador();
    guardadoJugadores('jugadores', listaJugadores);
    puntajesMasaltos();
    ocultarInput();
    reiniciarJuego();
  } else if (intentos < 5 && numeroElegido < numeroSecreto) {
    Toastify({
      text: `No no, ${nombreJugador} es un numero mas alto!`,
      duration: 2500,
      gravity: 'center',
      position: 'center',
      className: 'custom-toast',
      style: {
        background: 'linear-gradient(to right, #d85d5d, #fa2a2a)',
      },
    }).showToast();
    //mensajeJugando.textContent = `No no, ${nombreJugador} es un numero mas alto!`;
  } else if (intentos < 5 && numeroElegido > numeroSecreto) {
    Toastify({
      text: `Te pasaste ${nombreJugador} es un numero menor!`,
      duration: 2500,
      gravity: 'center',
      position: 'center',
      style: {
        background: 'linear-gradient(to right, #d85d5d, #fa2a2a)',
      },
      className: 'custom-toast',
    }).showToast();
    //mensajeJugando.textContent = `Te pasaste ${nombreJugador} es un numero menor!`;
  } else if (intentos === 5 && numeroElegido != numeroSecreto) {
    mensajeJugando.textContent = `Perdiste, se te acabaron los intentos, el numero secreto era: ${numeroSecreto}!`;
    puntajesMasaltos();
    ocultarInput();
    reiniciarJuego();
  }
});

loginJugador();

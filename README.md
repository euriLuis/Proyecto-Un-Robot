# Proyecto Un Robot

*Respuesta del capitulo 7 del libro Eloquent[^1]*

Proyecto que trata de una serie de robots que recorren una villa
en busca de paquetes para entregarlos en la dirección que tienen
predefinida.

**El proyecto esta dividido en tres módulos.**
1.Módulo robot: en este tenemos el código de los robots así como
la función encargada de ejecutarlos.
2.Módulo ville: este modulo posee la clase VilleState, aquí es
donde al un robot pasar por un sitio si esta presente un paquete
lo recoge y si es la dirección de entrega de un paquete que ya posee
lo entrega.
-esta clase posee el método `random()` el cual se encarga de crear
  el estado inicial de la Villa y de crear los paquetes y el numero
  deseado de paquetes [^2].
3.Módulo graf: posee los enlaces entre los sitios del pueblo y la función
 `buildGraph()` encargada de crear un grafo a partir de estos enlaces o caminos.

## Ejecución del proyecto

Este proyecto esta pensado para correr en nodeJS

```bash
node robot.js
```

*Para esto previamente se debe añadir  la llamada  a una de las funciones:*

 -`runRobot(state, robot, memory)` se encarga de ejecutar los robots dándole
 el estado, el robot y la memoria del robot.

```js
runRobot(VillageState.random(), routeRobot, []);
```

```bash
node robot
//Movido a Alices House
//Movido a Cabin
//Movido a Alices House
//...
//Terminado en 20 turnos
```

 -`compare(robot1, memoria1, robot2, memoria2)`  compara los robot a partir de
  una serie de tareas iguales(10 000 por defecto) para definir cual es mas eficiente

```js
compare(randomRobot, [], goalOrientedRobot, []);
```

```bash
node robot
//El promedio de pasos del robot 1 fue de 68.9163 y el del robot2 fue de 14.8986
```

**Robots**
-`randomRobot(state)` robot que recorre de forma aleatoria el pueblo hasta que termine
 entregando todos los paquetes.
-`routeRobot(state, memory)` robot que cuenta con una ruta predefinida que cubre todos
 los lugares del pueblo así al seguir esta ruta 2 veces se entregaran todos los paquetes.
-`goalOrientedRobot({place, parcels}, route)` robot que busca la ruta mas corta a un paquete, luego lo entrega siguiendo la ruta mas corta.
-`goalSmart({place, parcels}, route)` robot que determina cual es su objetivo mas cercano, entre recoger un paquete o entregar un paquete, sigue la ruta mas corta para completar esta tarea.

[^1]: disponible en <https://eloquentjavascript.net/>

[^2]: por defecto 5.

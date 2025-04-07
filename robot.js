import { VillageState } from "./ville.js";
import { buildGraph } from "./graf.js";
import { roads } from "./graf.js";
import { randomPick } from "./ville.js";
import { mailRoute } from "./graf.js";

const roadGraph = buildGraph(roads);

function runRobot(state, robot, memory) {
    for (let turn = 0;; turn++) {
        if (state.parcels.length == 0) {
            console.log(`Terminado en ${turn} turnos`);
            break;
        }
        let action =  robot(state, memory);
        state = state.move(action.direction);
        memory = action.memory;
        console.log(`Movido a ${action.direction}`);  
    }
}

function randomRobot(state) {
    return {direction: randomPick(roadGraph[state.place])}
}

function routeRobot(state, memory) {
    if (memory.length == 0) {
        memory = mailRoute; 
    }
    return {direction: memory[0], memory: memory.slice(1)};
}

function findRoute(graph, from, to) {
    let work = [{at: from, route: []}];
    for (let i = 0; i < work.length; i++) {
        let {at, route} = work[i];
        for (let place of graph[at]) {
            if (place == to) {
                return route.concat(place);
            }
            if (!work.some(w => w.at == place)) {
                work.push({at: place, route: route.concat(place)})
            }
        }
    }
}

function goalOrientedRobot({place, parcels}, route) {
    if (route.length == 0) {
      let parcel = parcels[0];
      if (parcel.place != place) {
        route = findRoute(roadGraph, place, parcel.place);
      } else {
        route = findRoute(roadGraph, place, parcel.address);
      }
    }
    return {direction: route[0], memory: route.slice(1)};
}

function goalSmart ({place, parcels}, route){
    if (route.length == 0) {
        
        let rutas = [];
        for (const pack of parcels) {
            if (pack.place !== place) {
                rutas.push(findRoute(roadGraph, place, pack.place));
            } else {
                rutas.push(findRoute(roadGraph, place, pack.address));
            }
        }
        route = rutas.reduce((minRoute, rutActual) => rutActual.length < minRoute.length ? rutActual : minRoute); 
    }
    return {direction: route[0], memory: route.slice(1)}
}

function contPas(state, robot, memory) {
    for (let turnos = 0;; turnos++) {
        
        if (state.parcels.length == 0) {return turnos;}

        let action =  robot(state, memory);
        state = state.move(action.direction);
        memory = action.memory;  
    }
}

function compare(robot1, memoria1, robot2, memoria2) {

    let pasos1 = 0, pasos2 = 0;
    let tareas = 10000; 

    for (let i = 0; i <= tareas; i++) {
        let estado = VillageState.random(20);
        pasos1 += contPas(estado, robot1, memoria1); 
        pasos2 += contPas(estado, robot2, memoria2);
    }
    console.log(`El promedio de pasos del robot 1 fue de ${pasos1 / tareas} y el del robot2 fue de ${pasos2 / tareas}`);
    
    return `El promedio de pasos del robot 1 fue de ${pasos1 / tareas} y el del robot2 fue de ${pasos2 / tareas}`;
}

//runRobot(VillageState.random(), goalSmart, [])

compare(goalOrientedRobot, [], goalSmart, [])
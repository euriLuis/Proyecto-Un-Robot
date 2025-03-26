const roads = [
    "Alice's House-Bob's House",   "Alice's House-Cabin",
    "Alice's House-Post Office",   "Bob's House-Town Hall",
    "Daria's House-Ernie's House", "Daria's House-Town Hall",
    "Ernie's House-Grete's House", "Grete's House-Farm",
    "Grete's House-Shop",          "Marketplace-Farm",
    "Marketplace-Post Office",     "Marketplace-Shop",
    "Marketplace-Town Hall",       "Shop-Town Hall"
];

const roadGraph = buildGraph(roads);

function buildGraph(edges) {
    let graph = Object.create(null);

    function addEdge(from, to) {
        if (from in graph) {
            graph[from].push(to);
        } else {
            graph[from] = [to]
        }
    }

    for (const [from, to] of edges.map(r => r.split("-"))) {
        addEdge(from, to);
        addEdge(to, from);
    }

    return graph;
}



class VillageState {
    constructor(place, parcels) {
      this.place = place;
      this.parcels = parcels;
    }
  
    move(destination) {
      if (!roadGraph[this.place].includes(destination)) {
        return this;
      } else {
        let parcels = this.parcels.map(p => {
          if (p.place != this.place) return p;
          return {place: destination, address: p.address};
        }).filter(p => p.place != p.address);
        
        return new VillageState(destination, parcels);
      }
    }
}

VillageState.random = function(parcelCount = 5) {
    let parcels = [];
    for (let i = 0; i < parcelCount; i++) {
      let address = randomPick(Object.keys(roadGraph));
      let place;
      do {
        place = randomPick(Object.keys(roadGraph));
      } while (place == address);
      parcels.push({place, address});
    }
    return new VillageState("Post Office", parcels);
};

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

function randomPick(array) {
    let choice = Math.floor(Math.random() * array.length);
    return array[choice];
}

function randomRobot(state) {
    return {direction: randomPick(roadGraph[state.place])}
}

const mailRoute = [
    "Alice's House", "Cabin", "Alice's House", "Bob's House",
    "Town Hall", "Daria's House", "Ernie's House",
    "Grete's House", "Shop", "Grete's House", "Farm",
    "Marketplace", "Post Office"
];

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
    let tareas = 1000; 

    for (let i = 0; i <= tareas; i++) {
        let estado = VillageState.random();
        pasos1 += contPas(estado, robot1, memoria1); 
        pasos2 += contPas(estado, robot2, memoria2);
    }
    return `El promedio de pasos del robot 1 fue de ${pasos1 / tareas} y el del robot2 fue de ${pasos2 / tareas}`;
}


//aveces funciona, aveces no 
function goalSmart({place, parcels}, route) {
    if (route.length == 0) {
        let parcel = parcels[0];

        if (parcel.place != place) {
            //buscar la ruta mas corta
            rut = () => {
                let rutas = [];
                for (let index = 0; index < parcels.length; index++) {
                    rutas.push(findRoute(roadGraph, place, parcels[index].place));
                }
                return rutas.reduce((minRoute, rutActual) => rutActual.length < minRoute.length ? rutActual : minRoute);
            }
            route = [...rut()];
        } else {
            //buscar la ruta mas corta
            rut = () => {
                let rutas = [];
                for (let index = 0; index < parcels.length; index++) {
                    rutas.push(findRoute(roadGraph, place, parcels[index].address));
                }
                return rutas.reduce((minRoute, rutActual) => rutActual.length < minRoute.length ? rutActual : minRoute);
            }
            route = [...rut()];
        }
    }
    return {direction: route[0], memory: route.slice(1)};
}

runRobot(VillageState.random(2), goalSmart, [])



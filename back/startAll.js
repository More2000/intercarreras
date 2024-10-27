const { spawn } = require("child_process");

// Función para ejecutar un script con 'node'
function ejecutarScript(nombre, ruta) {
    const proceso = spawn("node", [ruta]);

    proceso.stdout.on("data", (data) => {
        console.log(`[${nombre}]: ${data}`);
    });

    proceso.stderr.on("data", (data) => {
        console.error(`[${nombre} ERROR]: ${data}`);
    });

    proceso.on("close", (code) => {
        console.log(`[${nombre}] terminó con código ${code}`);
    });
}

// Ejecutar cada publicador y suscriptor en paralelo
ejecutarScript("pubLife", "states/pub/lifePub.js");
ejecutarScript("necesidadesPub", "states/pub/necesidadesPub.js");
ejecutarScript("happyPub", "states/pub/happyPub.js");
ejecutarScript("pubData", "pubSimulationTSH/pubs/pubData.js");
ejecutarScript("pubRevivir", "states/pub/revivirPub.js");

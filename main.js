const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");
const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);
const N = 100;
const cars = generateCars(N);

let bestCar = cars[0];
if (localStorage.getItem("bestBrain")) {
  for (let i = 0; i < cars.length; i++) {
    cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
    if (i != 0) {
      NeuralNetwork.mutate(cars[i].brain, 0.1);
    }
  }
}

const traffic = [
  new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 0.5),
  new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 0.5),
  new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 0.5),
  new Car(road.getLaneCenter(0), -500, 30, 50, "DUMMY", 0.5),
  new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", 0.5),
  new Car(road.getLaneCenter(1), -700, 30, 50, "DUMMY", 0.5),
  new Car(road.getLaneCenter(2), -700, 30, 50, "DUMMY", 0.5),
];

function generateCars(N) {
  const cars = [];
  for (let i = 0; i <= N; i++) {
    cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
  }
  return cars;
}

animate();

function save() {
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function discard() {
  localStorage.removeItem("bestBrain");
}

function animate(time) {
  // time is set automatically by requestAnimationFrame in the callback
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []); // empty so traffic dont get damaged by other traffic
  }

  for (let i = 0; i < cars.length; i++) {
    cars[i].update(road.borders, traffic);
  }

  // Fitness function
  bestCar = cars.find((c) => c.y == Math.min(...cars.map((c) => c.y)));

  carCanvas.height = window.innerHeight; // makes it clear
  networkCanvas.height = window.innerHeight; // makes it clear

  carCtx.save();
  //   trick that makes the camera follow the car
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);

  road.draw(carCtx);
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx, "red");
  }

  carCtx.globalAlpha = 0.2;

  for (let i = 0; i < cars.length; i++) {
    cars[i].draw(carCtx, "blue");
  }
  carCtx.globalAlpha = 1;
  bestCar.draw(carCtx, "blue", true);

  carCtx.restore();

  networkCtx.lineDashOffset = -time / 50;

  Visualizer.drawNetwork(networkCtx, bestCar.brain);

  requestAnimationFrame(animate);
}

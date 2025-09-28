const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");
const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);
const car = new Car(road.getLaneCenter(1), 100, 30, 50, "AI");
const traffic = [new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 0.5)];

animate();

function animate(time) {
  // time is set automatically by requestAnimationFrame in the callback
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []); // empty so traffic dont get damaged by other traffic
  }
  car.update(road.borders, traffic);

  carCanvas.height = window.innerHeight; // makes it clear
  networkCanvas.height = window.innerHeight; // makes it clear

  carCtx.save();
  //   trick that makes the camera follow the car
  carCtx.translate(0, -car.y + carCanvas.height * 0.7);

  road.draw(carCtx);
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx, "red");
  }
  car.draw(carCtx, "blue");

  carCtx.restore();

  networkCtx.lineDashOffset = -time / 50;

  Visualizer.drawNetwork(networkCtx, car.brain);

  requestAnimationFrame(animate);
}

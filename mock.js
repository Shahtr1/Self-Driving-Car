const getTraffic = () => {
  const traffic = [];
  const carCount = 50; // total number of cars

  for (let i = 0; i < carCount; i++) {
    const y = -200 * (i + 1) - Math.floor(Math.random() * 100);

    // 20% chance for two cars, 80% for one
    if (Math.random() < 0.2) {
      // Two cars in two different lanes
      const lanes = [0, 1, 2];
      const lane1 = lanes.splice(
        Math.floor(Math.random() * lanes.length),
        1
      )[0];
      const lane2 = lanes.splice(
        Math.floor(Math.random() * lanes.length),
        1
      )[0];

      traffic.push(
        new Car(
          road.getLaneCenter(lane1),
          y,
          30,
          50,
          "DUMMY",
          0.5,
          getRandomColor()
        )
      );
      traffic.push(
        new Car(
          road.getLaneCenter(lane2),
          y,
          30,
          50,
          "DUMMY",
          0.5,
          getRandomColor()
        )
      );
    } else {
      // Single car
      const lane = Math.floor(Math.random() * 3);
      traffic.push(
        new Car(
          road.getLaneCenter(lane),
          y,
          30,
          50,
          "DUMMY",
          0.5,
          getRandomColor()
        )
      );
    }
  }

  return traffic;
};

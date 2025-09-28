class Visualizer {
  static drawNetwork(context, network) {
    const margin = 50;
    const left = margin;
    const top = margin;
    const width = context.canvas.width - margin * 2;
    const height = context.canvas.height - margin * 2;

    Visualizer.drawLevel(context, network.levels[0], left, top, width, height);
  }

  static drawLevel(context, level, left, top, width, height) {
    const right = left + width;
    const bottom = top + height;

    const { inputs, outputs, weights, biases } = level;

    for (let i = 0; i < inputs.length; i++) {
      for (let j = 0; j < outputs.length; j++) {
        context.beginPath();
        context.moveTo(Visualizer.#getNodeX(inputs, i, left, right), bottom);

        context.lineTo(Visualizer.#getNodeX(outputs, j, left, right), top);

        context.lineWidth = 2;
        context.strokeStyle = getRGBA(weights[i][j]);
        context.stroke();
      }
    }

    const nodeRadius = 18;
    for (let i = 0; i < inputs.length; i++) {
      const x = Visualizer.#getNodeX(inputs, i, left, right);
      context.beginPath();
      context.arc(x, bottom, nodeRadius, 0, Math.PI * 2);
      context.fillStyle = "black";
      context.fill();
      context.beginPath();
      context.arc(x, bottom, nodeRadius * 0.6, 0, Math.PI * 2);
      context.fillStyle = getRGBA(inputs[i]);
      context.fill();
    }

    for (let i = 0; i < outputs.length; i++) {
      const x = Visualizer.#getNodeX(outputs, i, left, right);
      context.beginPath();
      context.arc(x, top, nodeRadius, 0, Math.PI * 2);
      context.fillStyle = "black";
      context.fill();
      context.beginPath();
      context.arc(x, top, nodeRadius * 0.6, 0, Math.PI * 2);
      context.fillStyle = getRGBA(outputs[i]);
      context.fill();

      context.beginPath();
      context.lineWidth = 2;
      context.arc(x, top, nodeRadius * 0.8, 0, Math.PI * 2);
      context.strokeStyle = getRGBA(biases[i]);
      context.setLineDash([3, 3]);
      context.stroke();
      context.setLineDash([]);
    }
  }

  static #getNodeX(nodes, index, left, right) {
    return lerp(
      left,
      right,
      nodes.length == 1 ? 0.5 : index / (nodes.length - 1)
    );
  }
}

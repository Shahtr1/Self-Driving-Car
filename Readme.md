1. You’re tracking one speed, but moving in two directions

Your speed variable is only the forward/backward amount along Y.

Left/right adds a separate sideways movement along X of 2 pixels per frame.

So each frame your car’s displacement is a vector:

$$
Δ = (dx, dy) = (±2, −speed)
$$

2. The thing your eyes care about is distance per frame (vector length), not your `speed` scalar

- The on-screen “how fast it moves” is the magnitude of that vector:

  $$
  \|\Delta\| = \sqrt{dx^2 + dy^2} = \sqrt{2^2 + (\text{speed})^2}
  $$

- This is **always** larger than $\lvert \text{speed} \rvert$ whenever $dx \neq 0$.  
  That’s why diagonals look faster.

---

3. How much faster is diagonal?

Some quick intuition:

- If $\text{speed} = 3$ (your max forward):

  $$
  \text{magnitude} = \sqrt{3^2 + 2^2} = \sqrt{13} \approx 3.606
  $$

  → about 20% faster.

- If $\text{speed} = 1$:

  $$
  \text{magnitude} = \sqrt{1^2 + 2^2} = \sqrt{5} \approx 2.236
  $$

  → more than 2× faster.

- The slower your forward speed is relative to that fixed sideways 2,  
  the bigger the diagonal boost feels.

=================================================================================

**_The solution, i.e, angle, works according to unit circle, rotated counterclockwise, because in our case, value of 0 is upwards. This would be our coordinate system for making rotations._**

### 1. Why a unit circle is used?

- The unit circle is just a mathematical tool:
  - It’s a circle with radius 1, centered at the origin.
  - Every point on it has coordinates `(cos θ, sin θ)`.
  - That means: given an angle θ, we can instantly know the X and Y components of a movement vector of length 1.

Why useful? Because when your car has an angle, you want to move it forward in the direction it’s facing.
Trigonometry (cos/sin) gives you those components.

### 2. Why the circle looks “rotated” compared to your canvas?

On the math unit circle:

- Angle 0 is to the right (positive X axis).
- Angles increase counterclockwise.
  So angle = 90° points up, 180° points left, etc.

But on your canvas coordinate system:

- X is still right, but Y grows downward.
- And in your setup, “angle 0” you’ve chosen is facing upwards, not to the right.

So you “rotate the circle” conceptually so that:

- 0° means pointing up (instead of right).
- Angles increase counterclockwise, same as math.

This way your math formulas match how the car moves visually.

3. How this translates into motion

When you drive forward:

- You want to move in the direction of the car’s angle.

- Using unit circle logic:

  - X change = sin(angle) \* speed
  - Y change = cos(angle) \* speed

Notice it’s sin for X, cos for Y (instead of the usual cos/sin swap). That’s because you rotated your definition of 0° so “up” is the starting point.

==============================================================

## Sensors

1. Range of angles

**_look at the unit-circle-sensor.png picture in pictures folder_**

- ray spread = 45 degrees;
- left boundary = +45/2 = +22.5 degrees;
- right boundary = -45/2 = -22.5 degrees;

So the allowed angles are between `–22.5°` and `+22.5°` relative to the car’s forward direction.

2. What lerp does?

```js
rayAngle = lerp(+spread / 2, -spread / 2, t);
```

- If `t = 0` → rayAngle = +22.5° (leftmost ray).
- If `t = 1` → rayAngle = –22.5° (rightmost ray).
- If `t = 0.5` → rayAngle = 0° (straight ahead).

3. Multiple rays

With `rayCount = 3` and `t = i/(rayCount-1)`:

- i=0 → t=0 → rayAngle = +22.5°
- i=1 → t=0.5 → rayAngle = 0°
- i=2 → t=1 → rayAngle = –22.5°

That matches your picture: left, center, right.

============================================================

## Representing car as a polygon

**Reference car_polygon.png in pictures folder**

1. What we want

We have a rectangle (the car) centered at `(cx, cy)` with width `w` and height `h`, rotated by `θ` (your `this.angle`). We want the world coordinates of the 4 rectangle corners so we can draw the rotated rectangle and do collisions.

```js
const rad = Math.hypot(this.width, this.height) / 2;
const alpha = Math.atan2(this.width, this.height);
```

1. Geometry — what rad and alpha are

Imagine the car rectangle centered at `(cx, cy)` with width `w` and height `h`. The 4 corners lie on the circle centered at `(cx, cy)` that passes through all corners.

rad = distance from center to any corner = half the diagonal of the rectangle.

​$$\text{rad} = \frac{\sqrt{w^2 + h^2}}{2}$$

alpha = angle between the rectangle’s vertical axis and the diagonal to a corner. The code uses

```js
alpha = Math.atan2(w, h);
```

If the car is rotated by `θ` (your this.angle), the corner’s global direction is `θ ± α` (and the opposite-corner directions are `θ ± α + π`).

2. The corner-angle formulas (the 4 directions)

Because corners are symmetric around the circle, their polar angles (measured from the car’s forward/vertical direction) are:

$$
\begin{aligned}
\phi_1 &= \theta - \alpha \\
\phi_2 &= \theta + \alpha \\
\phi_3 &= \theta + \pi - \alpha \\
\phi_4 &= \theta + \pi + \alpha
\end{aligned}
$$

(Those four are spaced by 90° = π/2 around the circle.)

Once you have a corner angle `φ`, convert polar → Cartesian (note: the formulas below assume the angle θ is measured from the vertical and that screen y increases downward, which is the common canvas convention):

```js
x = cx + rad * sin(phi);
y = cy - rad * cos(phi);
```

Why sin for x and cos for y? Because we used the vertical axis as the zero-angle reference:

- `φ = 0` points straight up (negative y),
- `sin(φ)` gives the horizontal offset,
- `cos(φ)` gives the vertical offset; because up is negative y we subtract `rad*cos(φ)`.

===================================

## Neural Network Idea

Imagine you’re driving with a self-driving AI brain that gets input from sensors.
The brain has to decide: go forward, turn, or brake.

1. Sensors (the $s_i$)

Sensors give numbers:

- $s_1$ = front distance (meters to obstacle ahead).
- $s_2$ = left distance (meters to obstacle on left).
- $s_3$ = right distance.
- $s_4$ = back distance.

Higher values mean "more space," lower means "danger close."

2. Weights (the $w_i$)

Each sensor has a different importance depending on the decision.

For braking neuron:

- $w_1$ = −2 (front very important).
- $w_2$ = −0.3 (left slightly matters).
- $w_3$ = −0.3 (right slightly matters).
- $w_4$ = 0 (back doesn’t matter).

Equation:

$$
  activation_{brake} = w_1\ s_1 + w_2\ s_2 + w_3\ s_3 + w_4\ s_4 + b
$$

### Table of Scenarios

| Scenario                           | $s_1$ (front) | $s_2$ (left) | $s_3$ (right) | $s_4$ (back) | Calculation                                                                   | Decision                                  |
| ---------------------------------- | ------------- | ------------ | ------------- | ------------ | ----------------------------------------------------------------------------- | ----------------------------------------- |
| A: Clear road                      | 20            | 10           | 10            | 8            | $(-2)(20) + (-0.3)(10) + (-0.3)(10) + 0 + 10$ = -40 - 3 - 3 + 10 = **-36**    | ❌ No brake                               |
| B: Car ahead (3m)                  | 3             | 10           | 10            | 8            | $(-2)(3) + (-0.3)(10) + (-0.3)(10) + 0 + 10$ = -6 - 3 - 3 + 10 = **-2**       | ❌ No brake yet                           |
| C: Car very close (1m)             | 1             | 10           | 10            | 8            | $(-2)(1) + (-0.3)(10) + (-0.3)(10) + 0 + 10$ = -2 - 3 - 3 + 10 = **2**        | ✅ Brake                                  |
| D: Wall close left                 | 20            | 1            | 20            | 8            | $(-2)(20) + (-0.3)(1) + (-0.3)(20) + 0 + 10$ = -40 - 0.3 - 6 + 10 = **-36.3** | ❌ No brake (better to steer left neuron) |
| E: Narrow gap (front 2m, sides 2m) | 2             | 2            | 2             | 8            | $(-2)(2) + (-0.3)(2) + (-0.3)(2) + 0 + 10$ = -4 - 0.6 - 0.6 + 10 = **4.8**    | ✅ Brake                                  |

### Intution:

- In A: Front is clear (big number), weighted heavily negative → car says “safe.”
- In B: Front is a little close, but not too bad. Total still below bias → no brake.
- In C: Obstacle super close → strong negative from front, but bias pushes total above 0 → Brake!
- In D: Side is blocked, but front is fine → no brake (steering neuron will handle it).
- In E: Everything is too close → total goes positive → Brake!

This is why we need multiple $w_{i's}$: each sensor contributes differently. Without weights, scenario A and C might look “equally safe,” which would crash the car.

### Scenario table for “Turn Left”

Possible weights:

- $w_1$ = −0.5 (if front blocked, consider turning).
- $w_2$=−2 (if left blocked, don’t turn left).
- $w_3$=+2 (if right blocked, do turn left).
- $w_4$=0 (back doesn’t matter).
- Bias = threshold.

### Putting it all together

At each moment:

- Brake neuron checks → should I brake?
- Turn-left neuron checks → should I steer left?
- Turn-right neuron checks → should I steer right?
- Forward neuron checks → should I just continue?

The car’s controller looks at all neuron outputs and decides final action.

| Brake | Left | Right | Forward | Car’s Action               |
| ----- | ---- | ----- | ------- | -------------------------- |
| 1     | 0    | 0     | 0       | Brake hard                 |
| 0     | 1    | 0     | 0       | Turn left                  |
| 0     | 0    | 1     | 0       | Turn right                 |
| 0     | 0    | 0     | 1       | Go forward                 |
| 0     | 1    | 0     | 1       | Slight left while moving   |
| 1     | 0    | 1     | 0       | Brake while steering right |

## Explaining code more better

The code randomizes both weights and biases between -1 and 1:

```js
level.weights[i][j] = Math.random() * 2 - 1; // between -1 and 1
level.biases[i] = Math.random() * 2 - 1; // between -1 and 1
```

So everything starts small, like:

- weights = -0.7, 0.3, 0.9 …
- biases = -0.2, +0.8, …

In most AI code, the sensor inputs are normalized into a small range (like 0 to 1).

- Distance 20m → normalized to 1.0.
- Distance 0m → normalized to 0.0.
- Distance 10m → normalized to 0.5.

### Putting it together

If inputs are in [0, 1], then:

- A weight between -1 and 1 is enough to scale its importance.
- A bias between -1 and 1 is enough to shift the threshold.

Example:

- Input s = 0.2 (obstacle fairly close).
- Weight w = −0.8.
- Bias b = 0.5.

Sum = $(−0.8)(0.2)+0.5=−0.16+0.5=0.34$.

If condition is sum > bias (or sum > threshold), that can flip the neuron on or off — even with small numbers.

```js
if (sum > level.biases[i]) {
  level.outputs[i] = 1;
} else {
  level.outputs[i] = 0;
}
```

Our code uses the formula:

$$
\text{output} =
\begin{cases}
1 & \text{if } \sum_j (s_j \cdot w_{j,i}) > b_i \\
0 & \text{otherwise}
\end{cases}
$$

Normally in neural networks, the formula is:

$$
z = \sum_j (s_j \cdot w_{j,i}) + b_i
$$

then apply activation (like step, sigmoid, ReLU).

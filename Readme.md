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

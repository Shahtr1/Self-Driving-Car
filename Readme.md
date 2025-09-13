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

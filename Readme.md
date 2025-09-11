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

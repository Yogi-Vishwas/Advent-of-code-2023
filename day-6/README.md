`f(time, distance) -> number of ways to win a race.`

let's say boat button `holding time = t' ms` <br>
so `speed = t' mm/ms` <br>
`time taken by boat to reach the distance = distance / t'`

`total time = t' + (distance / t')`

Now we have a constraint that total time must be less than the time.
So `total time < time`

```math
t' + (distance / t') < time
```

```math
t'^2 - time * t' + distance < 0
```

So basically we just need to find all the integers that lie between the two roots of this quadratic equation.

Roots of this quadratic equation can be found using

```math
root1 = (time + \sqrt{time^2 - 4 * distance}) / 2
```
```math
root1 = (time - \sqrt{time^2 - 4 * distance}) / 2
```

Gentle is a language for making generative art

import helpful libraries
```
import Colour
import Gradient as grad
import Noise.perlin as perlin
```

layers are just renderable values

exactly the same as any other type
```
out final = (...)
let layer = (...)
```

do maths with layers and colours and stuff
```
#f00 * perlin(grad.x, grad.y)^2
```

set colours with arrays or hex codes
```
let blue = [20, 40, 255]
let blue = #1428ff
let blue = Colour.blue
```
```
#w #wa #rgb #rgba #rrggbb #rrggbbaa
```
are all forms of hex colour codes

if? more like ternary operator. it needs to be inline, idk how a for loop can be implemented inline tho
```
  x < 0.5 ? 0 : 255
```




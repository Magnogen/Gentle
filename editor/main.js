// jshint esversion: 10

let $ = query => document.querySelector(query);

// syntax highlighting using tokens
$("[contenteditable]").addEventListener('input', ({ target }) => {

  let value = target.innerText;
  value = value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  if (value.length == 0 || value == '\n') value = '// Code with Gentle!';
  target.previousElementSibling.innerHTML = highlight(value+'\n');

});
$("[contenteditable]").dispatchEvent(new Event("input"));

function Layer(func) { return func; }
Layer.COLOR = function(c) {
  let col = c;
  let alpha = false;
  if (typeof col == 'string') {
    if (col[0] == '#') {
      col = col.substring(1);
      if ([4, 8].includes(col.length)) alpha = true;
      col = parseInt(col, 16);
    } else throw { name: 'GentleRuntimeError', message: 'Colour must start with a #' }
  }

  if (alpha)
    col = [((col >> 24)&255)/255, ((col >> 16)&255)/255, ((col >> 8)&255)/255, (col&255)/255];
  else
    col = [((col >> 16)&255)/255, ((col >> 8)&255)/255, (col&255)/255, 1];

  return new Layer((x, y) => col);
}
Layer.IF = function(condition, then, otherwise) {
  return new Layer( (x, y) => condition(x, y) ? then(x, y) : otherwise(x, y) )
}
Layer.LESS = function(a, b) { return new Layer( (x, y) => a(x, y) < b(x, y) ) }
Layer.MORE = function(a, b) { return new Layer( (x, y) => a(x, y) > b(x, y) ) }
Layer.ADD  = function(a, b) { return new Layer( (x, y) => {
  let A = a(x, y), B = b(x, y);
  if (typeof A == 'number') {
    if (typeof B == 'number') return A + B;
    if (Array.isArray(B)) return B.map((e, i) => A + e);
  }
  if (Array.isArray(A)) {
    if (typeof B == 'number') return A.map((e, i) => e + B);
    if (Array.isArray(B)) return A.map((e, i) => e + B[i]);
  }
} ) }
Layer.SUB  = function(a, b) { return new Layer( (x, y) => {
  let A = a(x, y), B = b(x, y);
  if (typeof A == 'number') {
    if (typeof B == 'number') return A - B;
    if (Array.isArray(B)) return B.map((e, i) => A - e);
  }
  if (Array.isArray(A)) {
    if (typeof B == 'number') return A.map((e, i) => e - B);
    if (Array.isArray(B)) return A.map((e, i) => e - B[i]);
  }
} ) }
Layer.MUL  = function(a, b) { return new Layer( (x, y) => {
  let A = a(x, y), B = b(x, y);
  if (typeof A == 'number') {
    if (typeof B == 'number') return A * B;
    if (Array.isArray(B)) return B.map((e, i) => A * e);
  }
  if (Array.isArray(A)) {
    if (typeof B == 'number') return A.map((e, i) => e * B);
    if (Array.isArray(B)) return A.map((e, i) => e * B[i]);
  }
} ) }
Layer.DIV  = function(a, b) { return new Layer( (x, y) => {
  let A = a(x, y), B = b(x, y);
  if (typeof A == 'number') {
    if (typeof B == 'number') return A / B;
    if (Array.isArray(B)) return B.map((e, i) => A / e);
  }
  if (Array.isArray(A)) {
    if (typeof B == 'number') return A.map((e, i) => e / B);
    if (Array.isArray(B)) return A.map((e, i) => e / B[i]);
  }
} ) }
Layer.NUMBER = function(n) { return new Layer( () => n ) }

Layer.X = function() { return new Layer((x, y) => x) }
Layer.Y = function() { return new Layer((x, y) => y) }

let COMPUTE = Layer.ADD(
  Layer.COLOR('#004cff'),
  Layer.MUL(
    Layer.Y(),
    Layer.SUB(Layer.COLOR('#0032a8'), Layer.COLOR('#004cff'))
  )
)

console.log(
  Layer.ADD(
    Layer.COLOR('#0032a8'),
    Layer.MUL(
      Layer.Y(),
      Layer.SUB(Layer.COLOR('#004cff'), Layer.COLOR('#0032a8'))
    )
  )(0, 0)
)

// COMPUTE = (x, y) => {
//   let a = Layer.Color('#004cff')();
//   let b = Layer.Color('#0032a8')();
  
//   return y < 0.5 ? a : b;
// };


// interpreting / painting
$('aside > span').addEventListener('click', () => {
  
  let source = $("[contenteditable]").innerHTML
  source = source.replaceAll('&nbsp;', ' ');
  source = source.replaceAll('&amp;', '&');
  source = source.replaceAll('&lt;', '<').replaceAll('&gt;', '>');
  source = source.replaceAll('<br>', '\n').replaceAll('<div>', '\n').replaceAll('<p>', '\n');
  source = source.replace(/<(.*?)>/g, '');
  
  let compiled = compile(source);
  let res;
  compiled = 
  res = evaluate(compiled);
  res += '<br /><br />';
  if (compiled.had_error) {
    res += `<span class="error">${compiled.errors.join('\n').replaceAll('\n', '<br />')}</span>`
  } else {
    res += JSON.stringify(compiled, null, '\t')
               .replaceAll('\n', '<br />');
  }
  $("[output]").innerHTML = res;

});

let group = document.createElement('div');
group.classList.add('output');

let label = document.createElement('span')
label.innerHTML = 'final'
group.appendChild(label);

group.appendChild(document.createElement('br'));

let canvas = document.createElement('canvas');
canvas.id = 'final';
group.appendChild(canvas);

$('[output]').appendChild( group );

(async () => {
  function shuffle(a,b,c,d){//array,placeholder,placeholder,placeholder
    c=a.length;while(c)b=Math.random()*c--|0,d=a[c],a[c]=a[b],a[b]=d
  }
  
  let ctx = $('canvas#final').getContext('2d');
  const { width, height } = ctx.canvas;
  
  let pixels = ctx.getImageData(0, 0, width, height);
  let coords = [...Array(width * height)].map((e, i) => ({ x: i%width, y: 0|(i/width) }));
  shuffle(coords);
  
  let last = 0;
  for (let {x, y} of coords) {
    let i = 4*(x + y*width);
    const col = COMPUTE(x/width, y/height);
    const [r, g, b, a] = col;
    pixels.data[i + 0] = 0|(0.5 + r * 255);
    pixels.data[i + 1] = 0|(0.5 + g * 255);
    pixels.data[i + 2] = 0|(0.5 + b * 255);
    pixels.data[i + 3] = 0|(0.5 + a * 255);
    if (performance.now() - last > 1000/60) {
      ctx.putImageData(pixels, 0, 0);
      await new Promise(requestAnimationFrame);
      last = performance.now();
    }
  }
  
  ctx.putImageData(pixels, 0, 0);
  
})()





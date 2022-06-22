const highlight = (_=>{
  
  let current, start;
  
  const COMMENT = (source) => {
    while (source[current] != '\n') {
      current++;
    }
    return `<span class="comment">${source.substring(start, current)+'\n'}</span>`
  }

  function highlight(source) {
    
    let res = '';
    current = start = 0;
    
    const toggle = () => {
      switch (source[current]) {
        case '/': if (source[current+1] == '/') return COMMENT(source);
      }
      return source[current];
    }
    
    while (current < source.length) {
      res += toggle();
      current++;
      start = current;
    }
    
    return res;
    
  }
  
  return highlight;
  
})();
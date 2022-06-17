const compile = (() => {
  
  function compile(source) {
    
    let scanned;
    const { tokens, had_error, errors } = scanned = scan(source);
    if (had_error) {
      scanned.errors = [`Compile failed due to Parse Error${scanned.errors.length>1?'s':''}.`].concat(...scanned.errors);
      return scanned;
    }
    
    return tokens;

  }
  
  return compile;
  
})();
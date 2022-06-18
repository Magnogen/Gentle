const highlight = (_=>{

  function highlight(source) {
    
    let res = source;
    
    res = res.replaceAll(/(("|')(\\\2|.)*?\2)/g, '<span class="string">$1</span>');
    
    return res;
    
  }
  
  return highlight;
  
})();
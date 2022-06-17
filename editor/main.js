let $ = query => document.querySelector(query);

// syntax highlighting using tokens
$("[contenteditable]").addEventListener('input', ({ target }) => {

  let value = target.innerText;
  value = value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  if (value.length == 0) value = '// Code with Gentle!';
  target.previousElementSibling.innerHTML = highlight(value+'\n');

});
$("[contenteditable]").dispatchEvent(new Event("input"));

// interpreting / painting
$('aside > span').addEventListener('click', () => {
  
  let source = $("[contenteditable]").innerHTML
  source = source.replaceAll('&nbsp;', ' ');
  source = source.replaceAll('&amp;', '&');
  source = source.replaceAll('&gt;', '>').replaceAll('&lt;', '<');
  source = source.replaceAll('<br>', '\n').replaceAll('<div>', '\n').replaceAll('<p>', '\n');
  source = source.replace(/<(.*?)>/g, '');
  
  let compiled = compile(source);
  let res;
  // res = evaluate(compiled);
  res += '<br /><br />';
  if (compiled.had_error) {
    res += `<span class="error">${compiled.errors.join('\n').replaceAll('\n', '<br />')}</span>`
  } else {
    res += JSON.stringify(compiled, null, '\t')
               .replaceAll('\n', '<br />');
  }
  $("[output]").innerHTML = res;

});
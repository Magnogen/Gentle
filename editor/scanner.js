const scan = (() => {
  
  // https://craftinginterpreters.com/scanning.html#token-type
  // https://github.com/Magnogen/Gentle/blob/main/resources/tokens_and_libraries.md
  
  function scan(source) {

    let tokens = [];
    let start = 0, current = 0, line = 0;
    let had_error = false;
    let errors = [];

    const Token = (type, lexeme, value, line) => ({
      type, lexeme, value, line,
      toString() { return `[${this.type}] ${lexeme} ${literal}`; }
    });
    const add_token = (type, value=null) => {
      const lexeme = source.substring(start, current);
      start = current;
      tokens.push(Token(type, lexeme, value, line));
    }
    const error = (name, message, line=null) => {
      errors.push(`${name}: ${message}\n    at line ${line}`);
      had_error = true;
    }
    const match = (char) => {
      console.log(char, source[current+1])
      if (source[current] == char) {
        current++; return true;
      }
      return false;
    }
    
    while (current < source.length) {
      console.log(source[current]);
      switch (source[current++]) {
        case '(': add_token('LPAREN'); break;
        case ')': add_token('RPAREN'); break;
        case '[': add_token('LSQUARE'); break;
        case ']': add_token('RSQUARE'); break;
        case ',': add_token('COMMA'); break;
        case '+': add_token('ADD'); break;
        case '-': add_token('PLUS'); break;
        case '*': add_token('MUL'); break;
        case '/': add_token('SLASH'); break;
        case '|': add_token('PIPE'); break;
        case '?': add_token('QMARK'); break;
        case ':': add_token('COLON'); break;
        case '~': add_token('RANDOM'); break;
        case '.':
          if (`${source[current]}${source[current+1]}` == '..') {
            current += 3;
            add_token('RANGE_SEP');
          } else add_token('DOT');
          break;
        case '=': add_token(match('=') ? 'EQ_EQ' : 'EQ'); break;
        case '>': add_token(match('=') ? 'GT_EQ' : 'GT'); break;
        case '<': add_token(match('=') ? 'LT_EQ' : 'LT'); break;
        case '&':
          if (match('&')) add_token('AND');
          else error('GelemSyntaxError', `Unexpected token '${source[current-1]}'`, line);
          break;
        case '|':
          if (match('|')) add_token('OR');
          else error('GelemSyntaxError', `Unexpected token '${source[current-1]}'`, line);
          break;
        case '!': add_token('NOT'); break;
        case ' ':  case '\t':  break;
        case '\n': add_token('LINE_END'); line++; break;
        default: error('GelemSyntaxError', `Unexpected token '${source[current-1]}'`, line);
      }
    }
    
    tokens.push(Token('EOF', null, null, line));
    
    return { tokens, had_error, errors };
    
  }
  
  return scan;
  
})();

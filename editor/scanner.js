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
    
    while (current < source.length) {
      switch (source[current++]) {
        case '(':  add_token('LPAREN'); break;
        case ')':  add_token('RPAREN'); break;
        case '[':  add_token('LSQUARE'); break;
        case ']':  add_token('RSQUARE'); break;
        case ',':  add_token('COMMA'); break;
        case '.':  add_token('DOT'); break;
        case '+':  add_token('ADD'); break;
        case '-':  add_token('PLUS'); break;
        case '*':  add_token('MUL'); break;
        case '/':  add_token('SLASH'); break;
        case '|':  add_token('PIPE'); break;
        case '?':  add_token('QMARK'); break;
        case ':':  add_token('COLON'); break;
        case '~':  add_token('RANDOM'); break;
        case '...':add_token('RANGE_SEP'); break;
        case '=':  add_token('EQ'); break;
        case '>':  add_token('GT'); break;
        case '<':  add_token('LT'); break;
        case '==': add_token('EQ_EQ'); break;
        case '>=': add_token('GT_EQ'); break;
        case '<=': add_token('LT_EQ'); break;
        case '&':  add_token('AND'); break;
        case '|':  add_token('OR'); break;
        case '!':  add_token('NOT'); break;
        case '\n': add_token('LINE_END'); line++; break;
        default:   error('GelemSyntaxError', `Unexpected token '${source[current-1]}'`, line);
      }
    }
    
    tokens.push(Token('EOF', null, null, line));
    
    return { tokens, had_error, errors };
    
  }
  
  return scan;
  
})();

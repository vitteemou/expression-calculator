function eval() {
  // Do not use eval!!!
  return;
}

function TypeError(message) {
  this.message = message;
}

function ExpressionError(message) {
  this.message = message;
}

function splitWithParenthes(expression, operator) {
  let expressionPart = '';
  let partsArray = [];
  let parenthesCounter = 0;

  for(let i = 0; i < expression.length; i++) {
    let curChar = expression[i];

    if(curChar === operator && parenthesCounter === 0) {
      partsArray.push(expressionPart);
      expressionPart = '';
      continue;
    }

    if(curChar === '(') {
      parenthesCounter++;
    }
    else if (curChar === ')') {
      parenthesCounter--;
    }
    expressionPart += curChar;
  }

  if(parenthesCounter !== 0) {
    throw new ExpressionError('ExpressionError: Brackets must be paired');
  }

  if (expressionPart !== '') {
		partsArray.push(expressionPart);
  }
  return partsArray;
}

function splitByDivision(expr) {
  var resultDivision = splitWithParenthes(expr, '/');
  const initValueExpression = resultDivision[0];
 
  
  const initValue = (initValueExpression[0] === '(') ? 
    splitByAddition(initValueExpression.substring(1, initValueExpression.length - 1)) :
    +initValueExpression;

  const calculationResult = resultDivision.slice(1).reduce((accum, value) => {
    if(+value === 0) {
      throw new TypeError("TypeError: Division by zero.");
    }

    if(value[0] === '(') {
      curDivider = splitByAddition(value.substring(1, value.length - 1));
    }
    else {
      curDivider = +value;
    }
    return accum / curDivider; 
  }, 
  initValue);

  return calculationResult;
}

function splitByMultiplication(expr) {
  var resultMultiplication = splitWithParenthes(expr, '*');
  resultMultiplication = resultMultiplication.map(exprPart => splitByDivision(exprPart));

  const initValue = 1;
  const calculationResult = resultMultiplication.reduce((accum, value) => { return accum * value; }, initValue);

  return calculationResult;
}

function splitBySubstraction(expr) {
  var resultMinus = splitWithParenthes(expr, '-');
  resultMinus = resultMinus.map(exprPart => splitByMultiplication(exprPart));

  const initValue = resultMinus[0];
  const calculationResult = resultMinus.slice(1).reduce((accum, value) => { return accum - value; }, initValue);
  
  return calculationResult;
}

function splitByAddition(expr) {
  var resultPlus = splitWithParenthes(expr, '+');
  resultPlus = resultPlus.map(exprPart => splitBySubstraction(exprPart));

  const initValue = 0.0;
  const calculationResult = resultPlus.reduce((accum, value) => { return accum + value; }, initValue);

  return calculationResult;
}

function expressionCalculator(expr) {

  if(!expr) {
    return 0;
  }

  let newExpr = '';

  for(let i = 0; i < expr.length; i++) {
    if(expr[i] !== ' ') {
      newExpr += expr[i];
    }
  }

  return splitByAddition(newExpr);
}

module.exports = {
  expressionCalculator
}
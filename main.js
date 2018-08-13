// ensures only one argument is passed to fn
const unary = fn => arg => fn(arg)

// returns passed value
const identity = value => value

// returns function that returns identity
const constant = value => identity(value)

// apply function partially
const partial = (fn, ...args) => (...laterArgs) => fn(...args, ...laterArgs)

"use strict";

// ensures only one argument is passed to fn
const unary = fn => arg => fn(arg)

// returns passed value
const identity = value => value

// returns function that returns identity
const constant = value => identity(value)

// apply function partially
const partial = (fn, ...args) => (...laterArgs) => fn(...args, ...laterArgs)

const curry = (fn, arity=fn.length) => (nextCurried = prevArgs => nextArg => {
  const args = [...prevArgs, nextArg]
  return args.length >= arity ? fn(...args) : nextCurried(args)
})([])

const complement = fn => (...args) => !fn(...args)

const compose = (...fns) => val => {
  return fns.reduceRight((acc, currentFn) => currentFn(acc), val)
}


const lazyCompose = (...fns) => fns.reduce((fn1, fn2) => {
  return (...args) => fn1(fn2(...args))
})

const reverseArgs = fn => (...args) => fn(...args.reverse())

const pipe = reverseArgs(lazyCompose)

const memoize = fn => {
  const cache = {}
  return arg => cache[arg] !== undefined ? cache[arg] : fn(arg)
}

const deepCopy = (obj, fn=identity) => {
  const isObject = typeof obj === "object"
  const isArray = Array.isArray(obj)
  if (isArray) {
    return fn(obj.map(deepCopy))
  } else if (isObject) {
    return fn(Object.keys(obj).reduce((acc, key) => {
      return Object.assign({}, acc, {[key]: deepCopy(obj[key])})
    }, {}))
  }
  return obj
}

const deepFreeze = obj => deepCopy(obj, Object.freeze)


const trampoline = fn => {
  return val => {
    let result = fn(val)
    while (typeof result === "function") {
      result = result()
    }
    return result
  }
}

const trampolineFactorial = trampoline(function factorial (n, runningTotal=1) {
  runningTotal = runningTotal * n
  if (n <= 1) return runningTotal
  return () => factorial(n - 1, runningTotal)
})

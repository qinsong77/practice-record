function createArray<T>(length: Number, value: T): Array<T> {
	const result: T[] = []
	for (let i = 0; i < length; i++) {
		result[i] = value
	}
	return result
}

// 多个类型参数
function swap<T, U>(tuple: [T, U]): [U, T] {
	return [tuple[1], tuple[0]]
}

// 泛型约束

interface LengthWise {
	length: number
}

function loggingIdentity<T extends LengthWise>(arg: T): T {
	console.log(arg.length)
	return arg
}


loggingIdentity('1')


function copyFields<T extends U, U>(target: T, source: U): T {
	for (let id in source) {
		if (source.hasOwnProperty(id) && !target.hasOwnProperty(id)) {
      target[id] = (<T>source)[id]
    }
	}
	return target
}

let x = {a: 1, b: 2, c: 3, d: 4}

copyFields(x, {b: 10, d: 20})

// 泛型接口

interface SearchFunc {
  (source: string, subString: string): boolean
}

let mySearch: SearchFunc

mySearch = function (source: string, subString: string) {
  return source.search(subString) === -1
}

interface CreateArrayFunc<T> {
  (length: number, value: T): Array<T>
}

let createArray2: CreateArrayFunc<any>

createArray2 = function<T> (length: number, value:T):Array<T> {
  const result: T[] = []
  for (let i = 0; i < length; i++) {
    result[i] = value
  }
  return result
}


// 泛型类

class GenericNumber<T> {
  zeroValue: T;
  add: (x: T, y:T) => T
}

//  检查对象上的键是否存在

function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

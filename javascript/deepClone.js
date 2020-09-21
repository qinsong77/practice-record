function isObject(target) {
	const type = typeof target
	return target !== null && (type === 'object' || type === 'function')
}

function cloneSymbol(target) {
	return Object(Symbol.prototype.valueOf.call(target))
}

function cloneReg(target) {
	const reFlags = /\w*$/
	const result = new target.constructor(target.source, reFlags.exec(target))
	result.lastIndex = target.lastIndex
	return result
}


function cloneFunction(func) {
	const bodyReg = /(?<={)(.|\n)+(?=})/m
	const paramReg = /(?<=\().+(?=\)\s+{)/
	const funcString = func.toString()
	if (func.prototype) { // 箭头函数没有prototype
		const param = paramReg.exec(funcString)
		const body = bodyReg.exec(funcString)
		if (body) {
			if (param) {
				const paramArr = param[0].split(',')
				return new Function(...paramArr, body[0])
			} else {
				return new Function(body[0])
			}
		} else {
			return null
		}
	} else {
		return eval(funcString)
	}
}
// while 遍历最快
function forEach(array, iteratee) {
	let index = -1;
	const length = array.length;
	while (++index < length) {
		iteratee(array[index], index);
	}
	return array;
}

function deepClone(target, map = new WeakMap()) { // weakMap 比Map好，因为是弱引用，key是null会自动垃圾回收
	if (!isObject(target)) return target
	const stringType = Object.prototype.toString.call(target)
	switch (stringType) {
		case '[object Boolean]':
		case '[object Number]':
		case '[object String]':
		case '[object Error]':
		case '[object Date]':
			return new target.constructor(target)
		case '[object RegExp]':
			return cloneReg(target)
		case '[object Symbol]':
			return cloneSymbol(target)
		case '[object Function]':
			return cloneFunction(target)
		case '[object Array]':
		case '[object Object]':
		case '[object Map]':
		case '[object Set]':
			// 防止循环引用
			if (map.get(target)) {
				return map.get(target)
			}
			const cloneTarget = new target.constructor(target)
			map.set(target,cloneTarget)
			
			if (stringType === '[object Set]') {
				target.forEach(v => cloneTarget.add(deepClone(v, map)))
			} else if (stringType === '[object Map]') {
				target.forEach((v, k) => cloneTarget.set(k, deepClone(v, map)))
			} else if (stringType === '[object Array]') {
				forEach(target, (v, index) => cloneTarget[index] = deepClone(v, map))
			} else {
				const keys = Object.keys(target)
				forEach(target, (v, index) => cloneTarget[keys[index]] = deepClone(v, map))
			}
			return cloneTarget
		default:
			return target
	}
	
}


const map = new Map();
map.set('key', 'value');
map.set('sysuke', '1sdfsad');

const set = new Set();
set.add('tom');
set.add('jack');

const target = {
	field1: 1,
	field2: undefined,
	field3: {
		child: 'child'
	},
	field4: [2, 4, 8],
	empty: null,
	map,
	set,
	bool: new Boolean(true),
	num: new Number(2),
	str: new String(2),
	symbol: Object(Symbol(1)),
	date: new Date(),
	reg: /\d+/,
	error: new Error(),
	func1: () => {
		console.log('test fun');
	},
	func2: function (a, b) {
		return a + b;
	}
};


const result = deepClone(target);

console.log(target);
console.log(result);

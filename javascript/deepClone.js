function isObject(target){
	const type = typeof target
	return target !== null && (type === 'object' || type === 'function')
}

console.log(isObject(Symbol('ts')))


function deepClone(target, hashMap = new WeakMap()){
	if (target === null) return target // 如果是null不进行拷贝操作
	// 可能是对象或者普通的值  如果是函数的话是不需要深拷贝
	if (typeof target !== 'object') return target
	// 是对象的话就要进行深拷贝

	if (hashMap.get(target)) {
		return hashMap.get(target)
	}

	let cloneTarget = new target.constructor()
	// 找到的是所属类原型上的constructor,而原型上的 constructor指向的是当前类本身
	// 防止循环引用
	hashMap.set(target, cloneTarget)
	const stringType = Object.prototype.toString.call(target)
	switch (stringType) {
		case '[object Boolean]':
		case '[object Number]':
		case '[object String]':
		case '[object Error]':
		case '[object Date]':
		case '[object RegExp]':
			return new target.constructor(target)
		case '[object Set]':
			target.forEach(v => cloneTarget.add(deepClone(v, hashMap)))
			break
		case '[object Map]':
			target.forEach((v, k) => cloneTarget.set(k, deepClone(v, hashMap)))
			break
		case '[object Array]':
			target.forEach((v, index) => cloneTarget[index] = deepClone(v, hashMap))
			break
		case '[object Object]':
			const keys = Object.keys(target)
			keys.forEach(key => cloneTarget[key] = deepClone(target[key], hashMap))
			break
	}
	return cloneTarget
}


const map = new Map()
map.set('key', 'value')
map.set('sysuke', '1sdfsad')
const obj = {
	test: 'hello'
}
obj.child = obj

const set = new Set()
set.add('tom')
set.add('jack')

const target = {
	num: 1,
	notNum: NaN,
	unD: undefined,
	empty: null,
	map,
	set,
	array: [2, 4, 8],
	boolObj: new Boolean(true),
	numObj: new Number(2),
	str: new String(2),
	symbol: Symbol(1),
	date: new Date(),
	reg: /\d+/,
	error: new Error('why'),
	obj: obj,
	func1: () => {
		console.log('test fun')
	},
	func2: function(a, b){
		return a + b
	}
}


console.log(target)
const result = deepClone(target)
target.bool = 'boolean11'
console.log(result)


function createData(deep, breadth){
	const data = {}
	let temp = data
	for (let i=0; i< deep; i++) {
		temp = temp['tt'] = {}
		for (let j=0; j <breadth; j++) {
			temp[j] = j
		}
	}
	return data
}



let count = 1
function deepClone2(source, hashMap = new WeakMap()){

	let cloneData = new source.constructor()
	// 循环数组
	const loopList = [
		{
			origin: source,
			key: undefined,
			data: cloneData,
		}
	]

	while (loopList.length) {
		count++
		// 深度优先遍历
		const node = loopList.pop()
		const origin = node.origin
		// const key = node.key
		const data = node.data
		const stringType = Object.prototype.toString.call(origin)

		switch (stringType) {
			case '[object Set]':
				origin.forEach(v => {

				})
				break
			case '[object Map]':
				origin.forEach((v, k) => data.set(k, deepClone(v, hashMap)))
				break
			case '[object Array]':
				origin.forEach((v, index) => data[index] = deepClone(v, hashMap))
				break
			case '[object Object]':
				const keys = Object.keys(origin)
				keys.forEach(key => {
					if (needDeepClone(origin[key])) {

						if (hashMap.get(origin[key])) {
							data[key] = origin[key]
						} else {
							loopList.push({
								origin: origin[key],
								data: new origin[key].constructor()
							})
						}

					} data[key] = copyBaseValue(origin[key])
				})
				break
		}

	}


	return cloneData
}



function needDeepClone(target){
	const stringType = Object.prototype.toString.call(target)
	return ['[object Set]', '[object Map]', '[object Array]', '[object Object]'].includes(stringType)
}
function copyBaseValue(target) {
	if (target === null) return target // 如果是null不进行拷贝操作
	// 可能是对象或者普通的值  如果是函数的话是不需要深拷贝
	if (typeof target !== 'object') return target
	return new target.constructor(target)
}

console.log(deepClone2(createData(10000, 2)))
console.log(count)

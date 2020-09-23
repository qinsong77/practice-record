function isObject(target) {
	const type = typeof target
	return target !== null && (type === 'object' || type === 'function')
}


function deepClone(target, hashMap = new WeakMap()) {
	if (target === null) return target // typeof null === 'object'
	if (typeof target !== 'object') return target // undefined, string, number, function, symbol
	// 是对象的话就要进行深拷贝
	// 处理循环引用
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
map.set('obj', {
	test: 'map-obj'
})
const obj = {
	test: 'hello'
}
obj.child = obj

const set = new Set()
set.add('tom')
set.add('jack')
set.add({
	test: 'set-obj'
})

const target = {
	num: 1,
	notNum: NaN,
	unD: undefined,
	empty: null,
	bool: false,
	map,
	set,
	// array: [2, 4, 8, obj],
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
	func2: function (a, b) {
		return a + b
	}
}


// console.log(target)
// const result = deepClone(target)
// target.bool = 'boolean11'
// console.log(result)


function createData(deep, breadth) {
	const data = {}
	let temp = data
	for (let i = 0; i < deep; i++) {
		temp = temp['tt'] = {}
		for (let j = 0; j < breadth; j++) {
			temp[j] = j
		}
	}
	return data
}


function deepClone2(data, hashMap = new WeakMap()) {
	
	if (!needDeepClone(data)) return copyBaseValue(data)
	
	let cloneData = new data.constructor()
	// 循环数组
	const loopList = [
		{
			source: data,
			target: cloneData,
		}
	]
	
	while (loopList.length) {
		// 深度优先遍历
		const node = loopList.pop()
		const source = node.source
		let target = node.target
		
		if (!hashMap.get(source)) {
			hashMap.set(source, target)
		}
		
		const stringType = Object.prototype.toString.call(source)
		
		switch (stringType) {
			case '[object Object]':
				const keys = Object.keys(source)
				keys.forEach(key => {
					if (needDeepClone(source[key])) {
						if (hashMap.get(source[key])) {
							target[key] = hashMap.get(source[key])
						} else {
							const newNode = {
								source: source[key],
								target: new source[key].constructor()
							}
							loopList.push(newNode)
							target[key] = newNode.target
						}
					} else {
						target[key] = copyBaseValue(source[key])
					}
				})
				break
			
			case '[object Array]':
				source.forEach(v => {
					if (needDeepClone(v)) {
						
						if (hashMap.get(v)) {
							target.push(hashMap.get(v))
						} else {
							const newNode = {
								source: v,
								target: new v.constructor()
							}
							loopList.push(newNode)
							target.push(newNode.target)
						}
					} else {
						target.push(copyBaseValue(v))
					}
				})
				break
			
			case '[object Map]':
				source.forEach((v, k) => {
					if (needDeepClone(v)) {
						if (hashMap.get(v)) {
							target.set(k, hashMap.get(v))
						} else {
							const newNode = {
								source: v,
								target: new v.constructor()
							}
							loopList.push(newNode)
							target.set(k, newNode.target)
						}
					} else {
						target.set(k, copyBaseValue(v))
					}
				})
				break
			
			case '[object Set]':
				source.forEach(v => {
					if (needDeepClone(v)) {
						
						if (hashMap.get(v)) {
							target.add(hashMap.get(v))
						} else {
							const newNode = {
								source: v,
								target: new v.constructor()
							}
							loopList.push(newNode)
							target.add(newNode.target)
						}
						
					} else {
						target.add(copyBaseValue(v))
					}
				})
				break
		}
	}
	
	
	return cloneData
}


function needDeepClone(target) {
	const stringType = Object.prototype.toString.call(target)
	return ['[object Set]', '[object Map]', '[object Array]', '[object Object]'].includes(stringType)
}

function copyBaseValue(target) {
	if (target === null) return target // typeof null === 'object'
	if (typeof target !== 'object') return target
	return new target.constructor(target)
}
const obj2 = createData(112122, 2)
// console.log(obj2)
// const copyObj = deepClone2(obj2)
//
// obj2['tt']['tt'] = 'sdo'
// console.log(obj2)
// console.log(copyObj)
target.obj2 = obj2
console.log(target)
const result = deepClone2(target)
target.bool = 'boolean11'
obj2.test = 1121
console.log(result)

const loopObj = {
	test: 'hello'
}
loopObj.child = loopObj

console.log(deepClone2(loopObj))
console.log(deepClone(loopObj))

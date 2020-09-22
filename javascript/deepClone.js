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


function deepClone2(source, hashMap = new WeakMap()) {
	
	let cloneData = new source.constructor()
	// 循环数组
	const loopList = [
		{
			origin: source,
			parent: null,
			parentType: null,
			dataKey: null,
			data: cloneData,
		}
	]
	
	while (loopList.length) {
		// 深度优先遍历
		const node = loopList.pop()
		const origin = node.origin
		const parent = node.parent
		const parentType = node.parentType
		let data = node.data
		let dataKey = node.dataKey
		const stringType = Object.prototype.toString.call(origin)
		
		if (hashMap.get(origin)) {
			data = hashMap.get(origin)
			if (parent && dataKey) {
				parentType === '[object Set]' ? parent.add(data) : parent[dataKey] = data
			}
			continue
		} else hashMap.set(origin, data)
		
		switch (stringType) {
			case '[object Object]':
				const keys = Object.keys(origin)
				keys.forEach(key => {
					if (needDeepClone(origin[key])) {
						loopList.push({
							origin: origin[key],
							parent: data,
							parentType: stringType,
							dataKey: key,
							data: new origin[key].constructor()
						})
					} else {
						data[key] = copyBaseValue(origin[key])
						if (parent && dataKey) {
							parentType === '[object Set]' ? parent.add(data) : parent[dataKey] = data
						}
					}
				})
				break
			
			case '[object Array]':
				origin.forEach((v, index) => {
					if (needDeepClone(v)) {
						loopList.push({
							origin: v,
							parent: data,
							dataKey: index,
							data: new v.constructor()
						})
					} else {
						data[index] = copyBaseValue(v)
						if (parent && dataKey) {
							parentType === '[object Set]' ? parent.add(data) : parent[dataKey] = data
						}
					}
				})
				break
			
			case '[object Set]':
				origin.forEach(v => {
					if (needDeepClone(v)) {
						loopList.push({
							origin: v,
							parent: data,
							dataKey: v,
							data: new v.constructor()
						})
					} else {
						data.add(copyBaseValue(v))
						if (parent && dataKey) {
							parentType === '[object Set]' ? parent.add(data) : parent[dataKey] = data
						}
					}
				})
				break
			case '[object Map]':
				origin.forEach((v, k) => {
					if (needDeepClone(v)) {
						loopList.push({
							origin: v,
							parent: data,
							dataKey: k,
							data: new v.constructor()
						})
					} else {
						data.set(k, copyBaseValue(v))
						if (parent && dataKey) {
							parentType === '[object Set]' ? parent.add(data) : parent[dataKey] = data
						}
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

// obj2['tt'] = 'sdo'
// console.log(obj2)
// console.log(copyObj)
target.obj2 = obj2
console.log(target)
const result = deepClone2(target)
target.bool = 'boolean11'
obj2.test = 1121
console.log(result)

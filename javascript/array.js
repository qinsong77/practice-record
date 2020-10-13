// 取并集
const arrayA = [1, 2, 3], arrayB = [2, 4, 3, 5]

function unionArray(arrayA, arrayB, compareFun = (a, b) => a === b) {
	const result = [...arrayA]
	arrayB.forEach(b => {
		if (!result.find(a => compareFun(a, b))) result.push(b)
	})
	return result
}

// 简化写法
console.log([...new Set([...arrayA, ...arrayB])])

// 取交集
function intersectionArray(arrayA, arrayB, compareFun = (a, b) => a === b) {
	return arrayA.filter(a => arrayB.find(b => compareFun(a, b)))
}

console.log(intersectionArray(arrayA, arrayB))
// 简化写法
const intersectionResult = [...new Set(arrayA.filter(v => new Set(arrayB).has(v)))]
console.log(intersectionResult)

// 取差集
function differenceArray(arrayA, arrayB, compareFun = (a, b) => a === b) {
	return arrayA.filter(a => !arrayB.find(b => compareFun(a, b)))
}

console.log(differenceArray(arrayA, arrayB))
const differenceResult = [...new Set(arrayA.filter(v => !new Set(arrayB).has(v)))]
console.log(differenceResult)

// 数组扁平化
let arr = [
	[1, 2, 2],
	[3, 4, 5, 5],
	[6, 7, 8, 9, [11, 12, [12, 13, [14]]]], 10
]

function myFlatArray(array) {
	const result = []
	let cycleArray = (arr) => {
		arr.forEach(v => {
			if (Array.isArray(v)) {
				cycleArray(v)
			} else {
				result.push(v)
			}
		})
	}
	cycleArray(array)
	return result
}

function flatten(array) {
	return array.reduce(
		(target, current) =>
			Array.isArray(current) ?
				target.concat(flatten(current)) :
				target.concat(current)
		, [])
}

console.log(flatten(arr))
const array = [3, 2, 1, 4, 5]
array.reduce((c, n) => Math.max(c, n))
Math.max.apply(null, array)
Math.max(...array)

// 使用reduce实现map
Array.prototype.reduceToMap = function (handler) {
	return this.reduce((target, current, index) => {
		target.push(handler.call(this, current, index))
		return target
	}, [])
}

// 使用reduce实现filter
Array.prototype.reduceToFilter = function (handler) {
	return this.reduce((target, current, index) => {
		if (handler.call(this, current, index)) {
			target.push(current)
		}
		return target
	}, [])
}

// 数组乱序
function disorder(array) {
	const length = array.length
	let current = length - 1
	let random
	while (current > -1) {
		random = Math.floor(length * Math.random());
		[array[current], array[random]] = [array[random], array[current]]
		current--
	}
	return array
}


console.log(disorder(flatten(arr)))

// 实现reduce
// prev, next, currentIndex, array
Array.prototype.myReduce = function (cb, prev) {
	let i = 0
	if (!prev) {
		prev = prev || this[0]
		i++
	}
	for (; i < this.length; i++) {
		prev = cb(prev, this[i], i, this)
	}
	return prev
}
const sum = [1, 2, 3].myReduce((prev, next) => {
	return prev + next
})

console.log(sum) // 6


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

// 数组去重
function unique(arr) {
	return arr.myReduce((prev, cur) => prev.includes(cur) ? prev : [...prev, cur], [])
}

const arr2 = [1, 1, 'true', 'true', true, true, 15, 15, false, false, undefined, undefined, null, null, NaN, NaN, 'NaN', 0, 0, 'a', 'a', {}, {}]
console.log(unique(arr2))

function unique2(array) {
	for (let i = 0; i < array.length; i++) {
		for (let j = i + 1; j < array.length; j++) {
			if (array[i] === array[j]) {
				array.splice(j, 1)
				j--
			}
		}
	}
	return array
}

console.log(unique2(arr2))


function unique3(array) {
	const arr = []
	for (let i = 0; i < array.length; i++) {
		if (arr.indexOf(array[i]) === -1) {
			arr.push(array[i])
		}
	}
	return arr
}

console.log(unique3(arr2))

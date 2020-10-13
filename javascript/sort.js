const arr = (function () {
	const arr = []
	let count = parseInt(Number(Math.random() * 100).toFixed(0))
	if (count > 15) count = 10
	console.log(`array length: ${count}`)
	while (count > 0) {
		arr.push(parseInt(Number(Math.random() * 100).toFixed(0)))
		count--
	}
	return arr
})()
console.log(arr)

// 冒泡排序

function bubbleSort(arr) {

	const len = arr.length

	for (let i = 0; i < len - 1; i++) {
		for (let j = 0; j < len - 1 - i; j++) {
			if (arr[j] > arr[j + 1]) {
				// let temp = arr[j]
				// arr[j] = arr[j + 1]
				// arr[j +1] = temp
				[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
			}
		}
	}

	return arr

}


// console.log (bubbleSort (arr))

// 选择排序

function selectionSort(arr) {
	const len = arr.length

	for (let i = 0; i < len - 1; i++) {
		let minIndex = i
		for (let j = i + 1; j < len; j++) {
			if (arr[j] < arr[minIndex]) {
				minIndex = j
			}
		}
		if (minIndex !== i) [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]]
	}

	return arr
}

// console.log(selectionSort (arr))

// const a = [ 70, 49, 5, 17, 24, 72, 85, 75, 68, 11 ]
function insertSort(arr) {

	const len = arr.length

	for (let i = 0; i < len; i++) {
		const v = arr[i + 1]
		let j = i + 1
		while (j > 0) {
			j--
			if (arr[j] > v) {
				[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
			}
		}
	}

	return arr
}

console.log(insertSort(arr))

// 归并排序
function mergeSort(arr) {
	if (arr.length > 1) {
		const { length } = arr
		const middle = Math.floor(length / 2)
		const left = mergeSort(arr.slice(0, middle))
		const right = mergeSort(arr.slice(middle))
		arr = merge(left, right)
	}
	return arr
}

function merge(left, right) {
	let i = 0, j = 0
	const result = []
	while (i < left.length && j < right.length) {
		result.push(left[i] < right[j] ? left[i++] : right[j++])
	}

	return result.concat(i < left.length ? left.slice(i) : right.slice(j))
}

console.log(mergeSort([2, 1, 4, 3]))
// [2, 4, 3, 1]
// left [2, 4]  right [1, 3]
//
// 1  j = 1 i = 0
// 1 2 j = 1 i =1
// 1 2 3 j = 2 i = 1

function mergePass(arr) { // 将每个元素看作是相邻的数组长度为1。
	let temp = new Array(arr.length), N = arr.length, length = 1
	let t // 迭代深度。
	for (t = 0; Math.pow(2, t) < N; t++, length *= 2) { // 每次跳过的长度翻倍。
		const even = t % 2 === 0 // 复用 arr 和 temp 来回赋值。
		for (let left = 0; left < N; left += 2 * length) { // 左边数组起始位置 left 从0开始。
			const middle = left + length < N ? left + length : left // 右边数组起始位置 middle 就是left + 一个数组长度length 但是不要超过 N 。
			const right = left + (2 * length) < N ? left + (2 * length) : N // 右边界 right 就是 left + 两个数组长度。
			merge2(even ? arr : temp, even ? temp : arr, left, middle, right) // 合并每两个相邻的数组。
		}
	}
	if (t % 2 === 0) {
		return arr//返回arr
	}
	return temp // 返回 temp 。
}

function merge2(arr, temp, left, middle, right) {
	const leftEnd = middle - 1 // 通过右边数组的起始位置得到左边数组的结束位置。
	while (left <= leftEnd && middle < right) { // 如果‘指针’没有越界。
		if (arr[left] > arr[middle]) { // 如果左边数组第一个元素比右边数组第一个元素大。
			temp[left + middle - leftEnd - 1] = arr[middle++] // 将右边数组最小的放入有序数组 temp（初始值为空)。
		} else {
			temp[left + middle - leftEnd - 1] = arr[left++] // 将左边数组最小的放入有序数组 temp（初始值为空)。
		}
	}
	while (left > leftEnd && middle < right) { // 如果左边数组放完了，右边数组还有元素。
		temp[left + middle - leftEnd - 1] = arr[middle++] // 那么依次将右边数组剩余的元素放入 temp 。
	}
	while (left <= leftEnd && middle >= right) { // 如果右边数组放完了，左边数组还有元素
		temp[left + middle - leftEnd - 1] = arr[left++] // 那么依次将左边数组剩余的元素放入 temp 。
	}
}

console.log(mergePass(arr))


// 快速排序

function quickSort(array) {
	return quickSort2(array, 0, array.length - 1)
}

function quick(array, left, right) {
	let index
	if (array.length > 1) {
		index = partition(array, left, right)
		if (left < index - 1) {
			quick(array, left, index - 1)
		}
		if (index < right) {
			quick(array, index, right)
		}
	}
	return array
}

function partition(array, left, right) {
	const pivot = array[Math.floor((right + left) / 2)]

	let i = left
	let j = right
	while (i <= j) {
		while (array[i] < pivot) {
			i++
		}

		while (array[j] > pivot) {
			j--
		}

		if (i <= j) {
			[array[i], array[j]] = [array[j], array[i]]
			i++
			j--
		}
	}
	return i
}


function quickSort2(array, start, end) {
	if (end - start < 1) {
		return array;
	}
	const target = array[start];
	let l = start;
	let r = end;
	while (l < r) {
		while (l < r && array[r] >= target) {
			r--;
		}
		array[l] = array[r];
		while (l < r && array[l] < target) {
			l++;
		}
		array[r] = array[l];
	}
	array[l] = target;
	quickSort2(array, start, l - 1);
	quickSort2(array, l + 1, end);
	return array;
}

console.log(quickSort(arr))

// 计数排序

function countingSort(array){
	if (array.length < 2) return array

	const maxValue = Math.max(...array)

	const counts = new Array(maxValue + 1)

	array.forEach(element => {
		if (!counts[element]) counts[element] = 0
		counts[element]++
	})
	let sortIndex = 0

	counts.forEach((count, i) => {
		while (count > 0) {
			array[sortIndex++] = i
			count--
		}
	})

	return array
}

// console.log(countingSort(arr))



/*
	搜索算法
*/

//顺序搜素 for循环

// 二分搜索

function binarySearch(array, val){

	const sortedArray = quickSort(array)

	let low = 0
	let high = sortedArray.length - 1

	while (low <= high) {
		const mid = Math.floor((low + high)/2)

		const midVal = array[mid]
		if (midVal === val) return mid
		if (midVal > val) {
			high = mid - 1
		} else {
			low = mid + 1
		}
	}

	return  -1
}

console.log(binarySearch([1, 12, 14, 34, 80, 122], 122))

// 分而治之 解决二分查找
function binarySearchRecursive(array, val, low, high){
	if (low <= high) {
		const mid = Math.floor((low + high) / 2)
		const midVal = array[mid]
		if (midVal > val) {
			return binarySearchRecursive(array, val, low, mid - 1)
		} else if (midVal > val) {
			return binarySearchRecursive(array, val, low + 1, high)
		} else {
			return midVal
		}
	}
	return -1
}

// 最小硬币找零问题


function minCoinChange(coins, amount){
	const cache = []
	const makeChange = (value) => {
		if (!value) {
			return []
		}
		if (cache[value]) {
			return cache[value]
		}

		let min = []
		let newMin
		let newAmount
		for (let i = 0; i < coins.length; i++) {
			const coin = coins[i]
			newAmount = value - coin
			if (newAmount >= 0) {
				newMin = makeChange(newAmount)
			}
			if (newAmount >= 0 &&
				(newMin.length < min.length - 1 || !min.length) &&
				(newMin.length || !newAmount)) {
				min = [coin].concat(newMin)
				console.log('new Min ' + min + ' for ' + amount)
			}
		}
		return ([cache[value] = min])
	}
	return makeChange(amount)
}


console.log(minCoinChange([1,3, 4], 6))

function lcs(wordX, wordY){

}

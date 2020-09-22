const arr = (function () {
	const arr = []
	let count = parseInt (Number (Math.random () * 100).toFixed (0))
	if (count > 15) count = 10
	console.log (`array length: ${count}`)
	while (count > 0) {
		arr.push (parseInt (Number (Math.random () * 100).toFixed (0)))
		count--
	}
	return arr
}) ()
console.log (arr)

// 冒泡排序

function bubbleSort (arr) {

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

function selectionSort (arr) {
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
function insertSort (arr) {

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

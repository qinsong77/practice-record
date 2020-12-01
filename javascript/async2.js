

var getNumbers = () => {
	return Promise.resolve([1, 2, 3])
}
var multi = num => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			if (num) {
				resolve(num * num)
			} else {
				reject(new Error('num not specified'))
			}
		}, 1000)
	})
}

async function asyncForEach(array, callback) {
	for (let index = 0; index < array.length; index++) {
		await callback(array[index], index, array)
	}
}
async function test () {
	var nums = await getNumbers()
	asyncForEach(nums, async x => {
		var res = await multi(x)
		console.log(res)
	})
}


test()

function log(str) {
	return new Promise((resolve => {
		setTimeout(() => {
			resolve(str)
		}, 5000)
	}))
}

async function print() {
	for (let i = 0; i < 3; i++) {
		const str = await log(i)
		console.log(i)
	}
}

// print()

async function func() {
	for await (let i of [1, 2, 3]) { //异步迭代
		log(i).then(res => {
			console.log(res)
		})
	}
}

func()

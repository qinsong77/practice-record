function factorialIterative(n) {
	if (n === 1) return 1
	return n * factorialIterative(n - 1)
}

console.log(factorialIterative(5))

// let i = 0
// function recursiveFn() {
// 	i++
// 	recursiveFn()
// }
// try {
// 	recursiveFn()
// }catch (e) {
// 	console.log(i) // 15698
// 	console.log(e)
// }

function fibonacci(n) {
	if (n < 1) return 0
	if (n <= 2) return 1
	return fibonacci(n - 1) + fibonacci(n - 2)
}

console.log(fibonacci(2))
function fibonacciMemoization(n) {
	const memo = [0, 1]; // {1}
	const fibonacci = (n, memo) => {
		if (memo[n] != null) return memo[n]; // {2}
		return memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo); // {3}
	};
	return fibonacci;
}

function fibonacciMemoization(n) {
	const memo = [0, 1]; // {1}
	const fibonacci = (n) => {
		if (memo[n] !== undefined) return memo[n]; // {2}
		return memo[n] = fibonacci(n - 1) + fibonacci(n - 2); // {3}
	};
	return fibonacci;
}
console.log(fibonacciMemoization()(10))

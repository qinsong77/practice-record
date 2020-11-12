
// https://github.com/ben-Run/promiseAplus/blob/master/myPromise/promise3.js
/*
完善promise 的其他方法
all
allSettled
any
race
catch
finlly
*/

const PENDING = 'PENDING',
	FULFILLED = 'FULFILLED',
	REJECTED = 'REJECTED';

// 处理then返回结果的流程
function resolvePromise(promise2, x, resolve, reject) {
	if (promise2 === x) {
		return reject(new TypeError('Chaining cycle detected for promise #<myPromise>'))
	}
	
	let called = false
	
	if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
		try {
			let then = x.then
			// 判断是否是promise
			if (typeof then === 'function') {
				then.call(x, (y) => {
					// 如果 resolvePromise 以值 y 为参数被调用，则运行 [[Resolve]](promise, y)
					if (called) return
					called = true
					resolvePromise(promise2, y, resolve, reject)
				}, (r) => {
					if (called) return
					called = true
					reject(r)
				})
			} else {
				resolve(x)
			}
		} catch (e) {
			if (called) return
			called = true
			reject(e)
		}
	} else {
		// 如果 x 不为对象或者函数，以 x 普通值执行回调
		resolve(x)
	}
}

class myPromise {
	constructor (executor) {
		this.status = PENDING
		this.value = undefined
		this.reason = undefined
		
		this.onResolveCallbacks = []
		this.onRejectedCallbacks = []
		
		const resolve = (value) => {
			// 如果是promise 继续执行他的then
			if (value instanceof myPromise) {
				value.then(resolve, reject)
				return;
			}
			
			if (this.status === PENDING) {
				this.status = FULFILLED
				this.value = value
				// 发布
				this.onResolveCallbacks.forEach((fn) => fn())
			}
		}
		
		const reject = (reason) => {
			if (this.status === PENDING) {
				this.status = REJECTED
				this.reason = reason
				// 发布
				this.onRejectedCallbacks.forEach((fn) => fn())
			}
		}
		
		try {
			// 执行传进来的fn, 在给他提供改变状态的内部fn
			executor(resolve, reject)
		} catch(e) {
			reject(e)
		}
		
		
	}
	
	// 不仅仅是返回一个新的promise
	// 1. 还要处理状态的改变
	// 2. 值得传递
	// so 在执行回调的时候我们把这部分抽到 resolvePromise 函数中
	then(onFulfilled, onRejected) {
		onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value
		onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason }
		
		// return new promise
		let promise2 = new myPromise((resolve, reject) => {
			if (this.status === FULFILLED) {
				setTimeout(() => {
					try {
						let x = onFulfilled(this.value);
						resolvePromise(promise2, x, resolve, reject);
					} catch(e) {
						reject(e)
					}
				}, 0)
			}
			
			if (this.status === REJECTED) {
				setTimeout(() => {
					try {
						let x = onRejected(this.reason);
						resolvePromise(promise2, x, resolve, reject);
					} catch(e) {
						reject(e)
					}
				}, 0)
			}
			
			if (this.status === PENDING) {
				// 订阅
				this.onResolveCallbacks.push( () => {
					// 因为then的回调是放在异步，所以这里暂时用宏任务settimeout来模拟
					setTimeout(() => {
						try {
							let x = onFulfilled(this.value) // x: 普通值 or promise
							// resolve、reject 是用来改变状态，所以需要传进去
							resolvePromise(promise2, x, resolve, reject)
						} catch (e) {
							reject(e)
						}
					}, 0)
				})
				
				this.onRejectedCallbacks.push(() => {
					setTimeout(() => {
						try {
							let x = onRejected(this.reason) // x: 普通值 or promise
							resolvePromise(promise2, x, resolve, reject)
						} catch (e) {
							reject(e)
						}
					}, 0)
				})
			}
		})
		return promise2
	}
	
	// 捕获异常
	catch (errorCallback) {
		return this.then(null, errorCallback);
	}
	
	// 返回一个promise，在promise结束时，无论结果是fulfilled或者是rejected，都会执行指定的回调函数
	finally (cb) {
		this.then(value => {
			return myPromise.resolve(cb()).then(_ => value)
		}, reason => {
			return myPromise.resolve(callback()).then(() => {
				throw reason
			})
		})
	}
	
	
	static reject (reason) {
		return new myPromise((resolve, reject) => {
			reject(reason)
		})
	}
	
	static resolve (value) {
		return new myPromise((resolve, reject) => {
			resolve(value)
		})
	}
	
	/**
	 * myPromise.all可以将多个Promise实例包装成一个新的Promise实例。
	 * 全部成功的时候返回的是一个结果数组，其中一个失败的时候则返回reject的原因。
	 * mdn: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/myPromise/all
	 */
	
	static all (iterable) {
		// 检测是否为可遍历类型
		if (iterable == null || typeof iterable[Symbol.iterator] !== "function") {
			return new TypeError(
				`TypeError: ${typeof iterable} ${iterable} is not iterable`
			)
		}
		
		return new myPromise((resolve, reject) => {
			if (iterable.length === 0) return resolve([])
			// 用于存放结果
			const ret = []
			// 计数器
			let finishedNumber = 0
			
			function setResultValue(value, index) {
				ret[index] = value
				finishedNumber++
				if (finishedNumber === iterable.length) {
					resolve(ret)
				}
			}
			
			for (let i = 0, len = iterable.length; i < len; i++) {
				if (iterable[i] && typeof iterable[i].then === "function") {
					// 对promise类型在获得结果后将结果添加到数组中
					try {
						iterable[i].then(
							(value) => {
								setResultValue(value, i);
							},
							(reason) => {
								return reject(reason)
							}
						)
					} catch(e) {
						return reject(e)
					}
				} else {
					// 非promise类型直接添加到结果
					setResultValue(iterable[i], i)
				}
			}
		})
	}
	
	// 返回一个在所有给定的promise都已经fulfilled或rejected后的promise，并带有一个对象数组，每个对象表示对应的promise结果
	// 只有等到所有这些参数实例都返回结果，不管是fulfilled还是rejected，才会结束，且返回的promise 的值是一个数组，里面是每一个promise 执行的结果对象。
	
	static allSettled (iterable) {
		// 检测是否为可遍历类型
		if (iterable == null || typeof iterable[Symbol.iterator] !== "function") {
			return new TypeError(
				`TypeError: ${typeof iterable} ${iterable} is not iterable`
			);
		}
		return new myPromise((resolve, reject) => {
			if (iterable.length === 0) return resolve([])
			// 用于存放结果
			const ret = []
			
			for (let i = 0, len = iterable.length; i < len; i++) {
				if (iterable[i] && typeof iterable[i].then === "function") {
					iterable[i].then(
						(value) => {
							ret.push({ status: FULFILLED, value })
							ret.length === iterable.length && resolve(ret)
						},
						(reason) => {
							ret.push({ status: REJECTED, reason })
							ret.length === iterable.length && resolve(ret)
						}
					)
				} else {
					ret.push({ status: FULFILLED, value: iterable[i] })
					ret.length === iterable.length && resolve(ret)
				}
			}
		})
	}
	
	// 只要其中的一个 promise 成功，就返回那个已经成功的 promise 。
	// 如果可迭代对象中没有一个 promise 成功（即所有的 promises 都失败/拒绝），就返回一个失败的 promise 和AggregateError类型的实例，
	// 它是 Error 的一个子类，用于把单一的错误集合在一起。本质上，这个方法和Promise.all()是相反的。
	
	static any (iterable) {
		if (iterable == null || typeof iterable[Symbol.iterator] !== "function") {
			return new TypeError(
				`TypeError: ${typeof iterable} ${iterable} is not iterable`
			)
		}
		return new myPromise((resolve, reject) => {
			if (iterable.length === 0) return resolve([])
			// 用于存放结果
			const ret = []
			for (let i = 0, len = iterable.length; i < len; i++) {
				if (iterable[i] && typeof iterable[i].then === "function") {
					iterable[i].then(
						(value) => {
							resolve(value)
						},
						(reason) => {
							ret.push(reason)
							ret.length === iterable.length && reject(new AggregateError(ret, 'All promises were rejected'))
						}
					)
				} else {
					resolve(promise.resolve(iterable[i]))
				}
			}
		})
	}
	
	// 返回一个 promise，一旦迭代器中的某个promise解决或拒绝，返回的 promise就会解决或拒绝。
	static race (iterable) {
		// 检测是否为可遍历类型
		if (iterable === null || typeof iterable[Symbol.iterator] !== "function") {
			return new TypeError(
				`TypeError: ${typeof iterable} ${iterable} is not iterable`
			)
		}
		return new myPromise((resolve, reject) => {
			for (let i = 0, len = iterable.length; i < len; i++) {
				if (iterable[i] && typeof iterable[i].then === "function") {
					iterable[i].then(
						(value) => resolve(value),
						(reason) => reject(reason)
					)
				} else {
					resolve(iterable[i], i);
				}
			}
		})
	}
}

// myPromise.reject = function (reason) {
//   return new myPromise((resolve, reject) => {
//     reject(reason);
//   });
// };

// myPromise.resolve = function (data) {
//   return new myPromise((resolve, reject) => {
//     resolve(data);
//   });
// };

myPromise.defer = myPromise.deferred = function () {
	let deferred = {}
	
	deferred.promise = new myPromise((resolve, reject) => {
		deferred.resolve = resolve
		deferred.reject = reject
	})
	return deferred
}


module.exports = myPromise

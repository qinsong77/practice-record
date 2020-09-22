const obj = {
	name: 11,
	sayName: function (p1, p2) {
		console.log(this.name)
		console.log(p1)
		console.log(p2)
	}
}
obj.sayName(12, 31)

const b = {
	name: 'b'
}

// obj.sayName.call(b, 12, 13)

Function.prototype.myCall = function (context = window, ...args) {
	console.log(args)
	if (this === Function.prototype) {
		return undefined
	}
	const fn = Symbol()
	context[fn] = this
	const result = context[fn](...args)
	delete context[fn]
	return result
}

obj.sayName.myCall(b, 12, 13)


Function.prototype.myApply = function (context, args) {
	// 首先判断调用对象是否为函数
	if (typeof this !== 'function') {
		throw new TypeError('error')
	}
	context = context || window
	const fn = Symbol()
	context[fn] = this
	const result = Array.isArray(args) ? context[fn](...args) : context[fn]()
	delete context[fn]
	return result
}

obj.sayName.myApply(b, [12, 31])

obj.sayName.bind(b, 12, 31)()


Function.prototype.myBind = function (context, ...args) {
	// 首先判断调用对象是否为函数
	if (typeof this !== 'function') {
		throw new TypeError('error')
	}

	const that = this

	return function F(...newArgs) {
		if (this instanceof F) {
			return new that(...args, ...newArgs)
		}
		return that.apply(context, args.concat(newArgs))
	}
}

function polyfillBind (fn, ctx){
	function boundFn(a){
		var l = arguments.length;
		return l
			? l > 1
				? fn.apply(ctx, arguments)
				: fn.call(ctx, a)
			: fn.call(ctx)
	}
}

// obj.sayName.myBind(b, 12, 31)()

function Point(x, y) {
	this.x = x
	this.y = y
}

Point.prototype.toString = function () {
	console.log(this.x + ',' + this.y)
}
var emptyObj = {}
var YAxisPoint = Point.myBind(emptyObj, 0/*x*/)

// 本页下方的 polyfill 不支持运行这行代码，
// 但使用原生的 bind 方法运行是没问题的：

// var YAxisPoint = Point.myBind(null, 0/*x*/);

/*（译注：polyfill 的 bind 方法中，如果把 bind 的第一个参数加上，
即对新绑定的 this 执行 Object(this)，包装为对象，
因为 Object(null) 是 {}，所以也可以支持）*/

var axisPoint = new YAxisPoint(5)
axisPoint.toString() // '0,5'

console.log(axisPoint instanceof Point) // true
console.log(axisPoint instanceof YAxisPoint) // true
console.log(new YAxisPoint(17, 42) instanceof Point) // true



/*
	函数柯里化
 */

function curry(func) {

	return function curried(...args) {
		if (args.length >= func.length) {
			return func.apply(this, args)
		} else {
			return function (...args2) {
				return curried.apply(this, args.concat(args2))
			}
		}
	}

}

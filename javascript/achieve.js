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

function bind3(asThis) {
	var slice = Array.prototype.slice;
	var args1 = slice.call(arguments, 1);
	var fn = this;
	if (typeof fn !== "function") {
		throw new Error("Must accept function");
	}
	function resultFn() {
		var args2 = slice.call(arguments, 0);
		return fn.call(
			resultFn.prototype.isPrototypeOf(this) ? this : asThis, // new 的情况下 this 改绑成 new 出来的对象实例
			args1.concat(args2)
		);
	}
	resultFn.prototype = fn.prototype;
	return resultFn;
}

// obj.sayName.myBind(b, 12, 31)()

function Create() {
	// 创建一个空对象
	const object = {}
	// 获取构造函数
	const Constructor = [].shift.call(arguments)
	// 链接到原型
	object.__proto__ = Constructor.prototype
	// 绑定this 执行构造函数
	const result = Constructor.apply(object, arguments)
	// 确保new出来是个对象
	return typeof result === 'object' ? result : object
}
// test
function Point(x, y) {
	this.x = x
	this.y = y
}
const point = Create(Point, 1, 2)


Point.prototype.toString = function () {
	console.log(this.x + ',' + this.y)
}
var emptyObj = {}
// var YAxisPoint = Point.myBind(emptyObj, 0/*x*/)
Function.prototype.bind3 = bind3
var YAxisPoint = Point.bind3(emptyObj, 0/*x*/)

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


class EventHub {
	cache = {};
	on(eventName, fn) {
		this.cache[eventName] = this.cache[eventName] || [];
		return this.cache[eventName].push(fn) -1; // push会返回index, 暂时用key作为键值
	}
	emit(eventName) {
		this.cache[eventName].forEach((fn) => fn());
	}
	off(eventName, fn) {
		const index = this.cache[eventName].findIndex(item => item === fn)
		if (index === -1) return;
		this.cache[eventName].splice(index, 1);
	}
	offIndex(eventName, index) {
		this.cache[eventName].splice(index, 1);
	}
}

const event = new EventHub()
function test11 () {
	console.log(111)
}
const index = event.on('test1', test11)
console.log(event)
event.offIndex('test1', index)
console.log(event)
// setTimeout(() => {
// 	event.emit('test1')
// }, 3000)

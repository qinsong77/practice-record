var uniqueOccurrences = function (arr) {
	const map = new Map()
	for (let i = 0; i < arr.length; i++) {
		const v = arr[i]
		if (map.has(v)) map.set(v, map.get(v) + 1)
		else map.set(v, 1)
	}
	const times = [...map.values()]
	console.log(times)
	return times.length < new Set(times).size
}

uniqueOccurrences(
	[1, 2, 2, 1, 1, 3])

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

// func()

function EventEmitter() {
	this._maxListeners = 10
	this._events = Object.create(null)
}

// 向事件队列添加事件
// prepend为true表示向事件队列头部添加事件
EventEmitter.prototype.addListener = function (type, listener, prepend) {
	if (!this._events) {
		this._events = Object.create(null)
	}
	if (this._events[type]) {
		if (prepend) {
			this._events[type].unshift(listener)
		} else {
			this._events[type].push(listener)
		}
	} else {
		this._events[type] = [listener]
	}
}

// 移除某个事件
EventEmitter.prototype.removeListener = function (type, listener) {
	if (Array.isArray(this._events[type])) {
		if (!listener) {
			delete this._events[type]
		} else {
			this._events[type] = this._events[type].filter(e => e !== listener && e.origin !== listener)
		}
	}
}

// 向事件队列添加事件，只执行一次
EventEmitter.prototype.once = function (type, listener) {
	const only = (...args) => {
		listener.apply(this, args)
		this.removeListener(type, listener)
	}
	only.origin = listener
	this.addListener(type, only)
}

// 执行某类事件
EventEmitter.prototype.emit = function (type, ...args) {
	if (Array.isArray(this._events[type])) {
		this._events[type].forEach(fn => {
			fn.apply(this, args)
		})
	}
}

// 设置最大事件监听个数
EventEmitter.prototype.setMaxListeners = function (count) {
	this.maxListeners = count
}


var emitter = new EventEmitter()

var onceListener = function (args) {
	console.log('我只能被执行一次', args, this)
}

var listener = function (args) {
	console.log('我是一个listener', args, this)
}

emitter.once('click', onceListener)
emitter.addListener('click', listener)

emitter.emit('click', '参数')
emitter.emit('click')

emitter.removeListener('click', listener)
emitter.emit('click')


function Singleton(name) {
	this.name = name
}

Singleton.prototype.getName = function () {
	return this.name
}

Singleton.getInstance = (function () {
	let instance
	return function (name) {
		if (!instance) {
			instance = new Singleton(name)
		}
		return instance
	}
})()

var a = Singleton.getInstance('tom')
var b = Singleton.getInstance('Tom')

console.log(a === b)

var img = document.getElementsByTagName('img')
var n = 0 //存储图片加载到的位置，避免每次都从第一张图片开始遍历
lazyload() //页面载入完毕加载可是区域内的图片
// 节流函数，保证每200ms触发一次
function throttle(event, time) {
	let timer = null
	return function (...args) {
		if (!timer) {
			timer = setTimeout(() => {
				timer = null
				event.apply(this, args)
			}, time)
		}
	}
}

window.addEventListener('scroll', throttle(lazyload, 200))

function lazyload() { //监听页面滚动事件
	var seeHeight = window.innerHeight //可见区域高度
	var scrollTop = document.documentElement.scrollTop || document.body.scrollTop //滚动条距离顶部高度
	for (var i = n; i < img.length; i++) {
		console.log(img[i].offsetTop, seeHeight, scrollTop)
		if (img[i].offsetTop < seeHeight + scrollTop) {
			if (img[i].getAttribute('src') == 'loading.gif') {
				img[i].src = img[i].getAttribute('data-src')
			}
			n = i + 1
		}
	}
}

if (IntersectionObserver) {
	let lazyImageObserver = new IntersectionObserver((entries, observer) => {
		entries.forEach((entry, index) => {
			let lazyImage = entry.target
			// 如果元素可见
			if (entry.intersectionRatio > 0) {
				if (lazyImage.getAttribute('src') == 'loading.gif') {
					lazyImage.src = lazyImage.getAttribute('data-src')
				}
				lazyImageObserver.unobserve(lazyImage)
			}
		})
	})
	for (let i = 0; i < img.length; i++) {
		lazyImageObserver.observe(img[i])
	}
}

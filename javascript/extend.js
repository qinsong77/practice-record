function Parent(name) {
	this.name = name
	this.colors = ['red', 'blue', 'green']
}

Parent.prototype.getName = function () {
	return this.name
}

function Child(name, age) {
	Parent.call(this, name) // 调用父类的构造函数，将父类构造函数内的this指向子类的实例
	this.age = age
}

//寄生组合式继承
Child.prototype = Object.create(Parent.prototype)
Child.prototype.constructor = Child

Child.prototype.getAge = function () {
	return this.age
}

let Tom = new Child('Tom', 17)
Tom.getAge()


(function (window, document) {
	'use strict'
	var jsonp = function (url, data, callback) {
		// 1.将传入的data数据转化为url字符串形式
		// {id:1,name:'jack'} => id=1&name=jack
		var dataStr = url.indexOf('?') === -1 ? '?' : '&'
		for (var key in data) {
			dataStr += key + '=' + data[key] + '&'
		}
		
		// 2 处理url中的回调函数
		// cbFuncName回调函数的名字 ：my_json_cb_名字的前缀 + 随机数（把小数点去掉）
		var cbFuncName = 'my_json_cb_' + Math.random().toString().replace('.', '')
		dataStr += 'callback=' + cbFuncName
		
		// 3.创建一个script标签并插入到页面中
		var scriptEle = document.createElement('script')
		scriptEle.src = url + dataStr
		
		// 4.挂载回调函数
		window[cbFuncName] = function (data) {
			callback(data)
			// 处理完回调函数的数据之后，删除jsonp的script标签
			document.body.removeChild(scriptEle)
		}
		
		document.body.appendChild(scriptEle)
	}
	window.$jsonp = jsonp
})(window, document)


function getStringParam(param) {
	let dataString = ''
	for (const key in param) {
		dataString += `${key}=${param[key]}&`
	}
	return dataString
}

function ajax(method = 'get', url, params) {
	return new Promise(((resolve, reject) => {
		const xhr = new XMLHttpRequest()
		const paramString = getStringParam(params)
		if (method === 'get' && paramString) {
			url.indexOf('?') ? url += paramString : url += `?${paramString}`
		}
		
		xhr.open(method, url)
		
		xhr.onload = function () {
			const result = {
				status: xhr.status,
				statusText: xhr.statusText,
				headers: xhr.getAllResponseHeaders(),
				data: xhr.response || xhr.responseText
			}
			if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
				resolve(result)
			} else {
				reject(result)
			}
		}
		// 设置请求头
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
		// 跨域携带cookie
		xhr.withCredentials = true
		// 错误处理
		xhr.onerror = function () {
			reject(new TypeError('请求出错'))
		}
		xhr.timeout = function () {
			reject(new TypeError('请求超时'))
		}
		xhr.onabort = function () {
			reject(new TypeError('请求被终止'))
		}
		if (method === 'post') {
			xhr.send(paramString)
		} else {
			xhr.send()
		}
	}))
}

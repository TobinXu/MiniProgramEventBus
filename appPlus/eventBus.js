/**
 * @authors 徐强国
 * @date 2022-8-8
 * eventBus，订阅/发布
 * 
 */

// 是否是字符串
function isString(str) {
  return typeof str === 'string'
}

// 是否是函数
function isFunction(fn) {
  return typeof fn === 'function'
}

// 消息中心
class MessageHub {
  constructor() {
      this.pubDictionary = {}
  }

  // 创建发布者
  createEvent(name, isGlobal) {
      if (!isString(name)) {
          console.error(`==请传入创建事件的名称 name==`)
          return false
      }
      let _pub = this.pubDictionary[name]
      if (_pub) {
          if (!isGlobal) {
              console.warn(`==${name} 事件已存在==`)
          }
          return _pub
      } else {
          let pub = new Publish(name, this)
          this.pubDictionary[name] = pub
          return pub
      }
  }

  removeEvent(name) {
      if (!isString(name)) {
          console.error(`==请传入删除事件的名称 name==`)
          return false
      }
      delete this.pubDictionary[name]
  }

  on(name, callback, mark) {
      if (!isString(name)) {
          console.error(`==请传入监听事件的名称 name==`)
          return false
      }
      console.log('ononoonon这里的区文体', this.pubDictionary, callback, mark)

      if (!isFunction(callback)) {
          console.error(`==请传入监听事件的回调函数 callback==`)
          return false
      }
      let pub = this.pubDictionary[name]
      if (pub) {
          let watcher = new Watcher(pub.dep, callback, mark)
          pub.dep.addSub(watcher)
      } else {
          console.error(`==尚未创建 ${name} 事件==`)
      }
  }

  off(name, callback) {
      if (!isString(name)) {
          console.error(`==请传入监听事件的名称 name==`)
          return false
      }
      if (!isFunction(callback)) {
          console.error(`==请传入监听事件的回调函数 callback==`)
          return false
      }
      let pub = this.pubDictionary[name]
      pub.dep.removeSub(callback)
  }

  emit(name, val) {
      if (!isString(name)) {
          console.error(`==请传入触发事件的名称 name==`)
          return false
      }
      console.log('这里的区文体emit', this.pubDictionary)
      let pub = this.pubDictionary[name]
      if (pub) {
          pub.refresh(val)
      } else {
          console.warn(`==${name} 事件不存在==`)
      }
  }

  clearEvent() {
      this.pubDictionary = {}
  }
}

//  发布者
class Publish {
  constructor(name, messageHub) {
      this.name = name
      this.messageHub = messageHub
      this.dep = new Dep(this)
  }

  refresh(val) {
      this.dep.notify(val)
  }
}

//  订阅者
class Watcher {
  constructor(dep, run, mark) {
      this.dep = dep
      this.run = run
      this.mark = mark || ''
  }

  update() {
      let val = this.dep.value
      let run = this.run
      run(val)
  }
}

// 依赖收集
class Dep {
  constructor(pub) {
      this.pub = pub
      this.subs = []
  }

  addSub(sub) {
      this.subs.push(sub)
  }

  removeSub(run) {
      let sub = this.subs.filter(item => item.run === run)[0]
      remove(this.subs, sub)
  }

  notify(val) {
      this.value = val
      let subs = this.subs.slice()
      for (let i = 0, l = subs.length; i < l; i++) {
          subs[i].update()
      }
  }
}

function remove(arr, el) {
  for (let i = 0; i < arr.length; i++) {
      if (arr[i] === el) {
          arr.splice(i, 1)
          return true
      }
  }
  return false
}

module.exports = MessageHub

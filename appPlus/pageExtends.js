/**
 * @authors 徐强国
 * @date 2022-08-15
 * 小程序全局构造函数App、Page扩展
 */
const { appLiftTimes, pageLiftTimes } = require('./config');

// 判断是否是App的生命周期及原始方法
function isAppLiftTimes (name, fn) {
    if (typeof fn === 'function') {
        return appLiftTimes.indexOf(name) > -1
    }
    return false
}

// 判断是否是Page的生命周期及原始方法
function isPageLiftTimes(name, fn) {
    if (typeof fn === 'function') {
        return pageLiftTimes.indexOf(name) > -1
    }
    return false
}

// 函数混入
function rewriteFn(context, name, fn) {
    if (context[name]) {
        let originFn = context[name];
        context[name] = function (e) {
            let argu = Array.prototype.slice.call(arguments);
            fn.apply(this, argu);
            return originFn.apply(this, argu)
        }
    } else {
        context[name] = fn
    }
}

// 是否是对象
function isObject(obj) {
    return obj !== null && typeof obj === 'object'
}

// 重写App
const originApp = App;
const appExtendsList = [];
App = function (obj) {
    // app拓展方法
    appExtendsList.forEach(item => {
        rewriteFn(obj, item.key, item.value)
    })
    return originApp(obj)
}
const appExtends = function (key, value) {
    if (isAppLiftTimes(key, value)) {
        appExtendsList.push({ key, value })
    } else {
        console.error('==*App暂不支持非生命周期的扩展*==', key)
    }
}

// 重写Page
const originPage = Page;
const pageExtendsList = [];
Page = function (obj) {
    let illegalKeys = Object.keys(obj).filter(key => /^\$+/.test(key));
    if (illegalKeys.length) {
        // throw new Error(`Page中自定义属性禁止以 \$ 开头， ${illegalKeys.join(', ')}`)
        console.error(`Page中自定义属性禁止以 \$ 开头， ${illegalKeys.join(', ')}`)
    }
    // 页面拓展方法
    pageExtendsList.forEach(item => {
        // 非生命周期属性只能拓展一次
        if (isPageLiftTimes(item.key, item.value)) {
            rewriteFn(obj, item.key, item.value)
        } else {
            if (typeof obj[item.key] === 'undefined') {
                obj[item.key] = item.value;
            } else {
                console.error(`Page中已拓展 ${item.key} 属性`, obj[item.key])
            }
        }
    })
    return originPage(obj)
}
const pageExtends = function (key, value) {
    // Page拓展属性，非生命周期的属性必须以 $ 开头
    if (/^\$+/.test(key) || isPageLiftTimes(key, value)) {
        if (isPageLiftTimes(key, value) || !pageExtendsList.filter(item => item.key === key).length) {
            pageExtendsList.push({ key, value })
        } else {
            console.warn(`==*Page中已扩展 ${key} 属性*==`)
        }
    } else {
        console.warn(`==*Page中拓展属性必须以 \$ 开头*==`, `\n key: ${key}`)
    }
}

const AppPlus = {
    appExtends: function (mixinObj, value) {
        if (typeof mixinObj === 'string') {
            appExtends(mixinObj, value)
        } else if (isObject(mixinObj)) {
            Object.keys(mixinObj).forEach(key => {
                appExtends(key, mixinObj[key])
            })
        } else {
            console.warn('==*请传入 对象 或者 key, value*==')
        }
    },
    pageExtends: function (mixinObj, value) {
        if (typeof mixinObj === 'string') {
            pageExtends(mixinObj, value)
        } else if (isObject(mixinObj)) {
            Object.keys(mixinObj).forEach(key => {
                pageExtends(key, mixinObj[key])
            })
        } else {
            console.warn('==*请传入 对象 或者 key, value*==')
        }
    }
}

module.exports = AppPlus

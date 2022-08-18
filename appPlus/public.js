/*
 * @Author: 徐强国
 * @Date: 2022-08-15 15:43:32
 * @Description: Page公共方法扩展
 */
const EventBus = require('./eventBus')
let eventBus
// 初始化页面的eventbus，事件用法参照dom2事件
export const initEventBus = (pageObj) => {
    // let eventBus = new EventBus();
    if (!eventBus) {
      eventBus = new EventBus();
    } else {

    }
    pageObj['$on'] = function () {
        let argu = Array.prototype.slice.call(arguments);
        eventBus.on(...argu)
    }
    pageObj['$off'] = function () {
        let argu = Array.prototype.slice.call(arguments);
        eventBus.off(...argu)
    }
    pageObj['$emit'] = function () {
        let argu = Array.prototype.slice.call(arguments);
        eventBus.emit(...argu)
    }
    // 创建页面声明的自定义事件
    let events = pageObj['events'];
    if (Array.isArray(events)) {
        events.forEach((event, index) => {
            if (typeof event === 'string') {
                eventBus.createEvent(event)
            } else {
                console.error(`==请传入String类型的事件名称== index:${index}`, events)
            }
        })
    } else if (typeof events !== 'undefined') {
        console.error('==events字段已被占用，用于声明当前页面需要创建的自定义事件，值为字符串数组== events:', events)
    }
  }

  module.exports = {
    onLoad(options) {
      this.$initPage()
    },

    $initPage() {
      if (!this.$on) {
        initEventBus(this)
      }
    },
  }
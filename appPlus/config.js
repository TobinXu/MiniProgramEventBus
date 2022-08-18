/**
 * @authors 徐强国
 * @date 2022-08-15
 * 小程序全局构造函数App、Page扩展规则配置项
 */
const config = {
  pageLiftTimes: ['onLoad', 'onReady', 'onShow', 'onHide', 'onUnload', 'onPullDownRefresh', 'onReachBottom', 'onShareAppMessage', 'onPageScroll', 'onTabItemTap'],
  pageMethods: [],
  pageProperties: ['data'],
  appLiftTimes: ['onLaunch', 'onShow', 'onHide', 'onError', 'onPageNotFound']
};

Object.freeze(config);

module.exports = config

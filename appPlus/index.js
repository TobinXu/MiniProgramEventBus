/*
 * @Author: 徐强国
 * @Date: 2022-08-15 15:18:12
 * @Description: 小程序提供扩展App、Page扩展入口
 * 
 * 
 * AppPlus提供拓展App及Page的接口，校验自定义属性命名
 * @param appExtends
 * @parm pageExtends
 * 
 * 传入一个对象，此对象的属性及方法将混入App或者Page实例中
 * 生命周期函数将与自定义的声明周期混合，且先执行，
 * 其他属性只能以$开头，且不可覆盖、混入，应避免名称重复
 */

const AppPlus = require('./pageExtends')
const Public = require('./public')

AppPlus.pageExtends(Public)
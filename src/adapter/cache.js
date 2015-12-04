'use strict';

import AVStore from './store';

/**
 * base adapter
 */
export default class extends think.adapter.base {
  /**
   * 初始化方法
   * @param  {Object} options []
   * @return {}         []
   */
  init(options){
    this.options = think.parseConfig(think.config('cache'), options);
    
    this.name = this.options.name || 'ThinkCache';
    this.timeout = this.options.timeout || 0;
    this.prefix = this.options.prefix || '';  
    this.salt = this.options.salt;

    this.store = new AVStore(think.extend({
                              name: this.name,
                              salt: this.salt,
                            }, think.config('leancloud')));

    this.gcType = "cache_leancloud";
    think.gc(this);  
  }
  /**
   * 获取缓存
   * @param  {String} name []
   * @return {Promise}      []
   */
  async get(name){
    let data = await this.store.get(this.prefix + name);
    if(!data){
      return;
    }

    if(data.expire && Date.now() > data.expire){
      return await this.store.delete(this.prefix + name);
    }else{
      return data.value;
    }
  }
  /**
   * 设置缓存
   * @param {String} name    []
   * @param {Mixed} value   []
   * @param {Number} timeout []
   * @return {Promise}
   */
  async set(name, value, timeout = this.timeout){
    if (think.isObject(name)) {
      timeout = value || timeout;
      let key = Object.keys(name)[0];
      value = name[key];
      name = key;
    }
    let data = {
      value: value,
      expire: Date.now() + timeout * 1000,
      timeout: timeout
    }
    return await this.store.set(this.prefix + name, data);
  }
  /**
   * 删除缓存
   * @param  {String} name []
   * @return {Promise}      []
   */
  async delete(name){
    return await this.store.delete(this.prefix + name);
  }
  /**
   * 缓存垃圾回收
   * @return {Promise} []
   */
  async gc(){
    let now = Date.now();
    let data = await this.store.list();
    for(var key in data){
      this.get(key.slice(this.prefix.length));
    }
  }
}
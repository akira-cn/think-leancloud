'use strict';

import AVCache from './cache';

/**
 * base adapter
 */
export default class extends think.adapter.base {
  /**
   * init
   * @return {[]}         []
   */
  init(options){
    options = think.parseConfig(options);
    
    this.timeout = options.timeout;
    this.cookie = options.cookie;

    this.isChanged = false;

    //用这个配置格式可以兼容旧版本的thinkjs，之前parseConfig有bug
    this.cache = new AVCache({
      adapter:{
        leancloud: {
          name: 'ThinkSession',
          timeout: this.timeout,
        }
      }
    });

    this.gcType = 'session_leancloud';
    think.gc(this);
  }
  async getData(){
    if(!this.data){
      this.data = await this.cache.get(this.cookie);
    }

    if(!this.data){
      this.data = {};
    }

    return this.data;
  }
  async get(name){
    let data = await this.getData();
    return data[name];
  }
  async set(name, value){
    let data = await this.getData();
    data[name] = value;
    this.isChanged = true;
  }
  async delete(name){
    let data = await this.getData();
    delete data[name];
    this.isChanged = true;
  }
  async flush(){
    if(this.isChanged){
      this.cache.set(this.cookie, this.data);
    }
  }
  async gc(){
    this.cache.gc();
  }
}
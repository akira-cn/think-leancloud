'use strict';

let AV = require('avoscloud-sdk');

/**
 * leancloud store adapter
 */
export default class Storage extends think.adapter.base {
  /**
    根据文档：
    AV.Object.extend 产生的对象需要作为全局变量保存，
    因为每调用 一次，就会产生一个新的类的实例，
    并且和之前创建的实例形成一个链表。 
    如果你的应用时不时出现 Maximum call stack size exceeded 错误，
    请确认是否误用了该方法。     
   */
  static getAVStorage(key){
    let storages = thinkCache(thinkCache.COLLECTION, 'leancloud_avstore');
    storages = storages || {};
    if(!storages[key]){
      storages[key] = AV.Object.extend(key);
      thinkCache(thinkCache.COLLECTION, 'leancloud_avstore', storages);
    }
    return storages[key];
  }
  /**
   * init
   * @return {[]}         []
   */
  init(config){
    let {name, appid, appkey} = config;
    this.name = name || "ThinkStorage";
    AV.initialize(appid, appkey);
  }
  getInstance(key){
    let AVStorage = Storage.getAVStorage(this.name);
    return new Promise((resolve, reject) => {
      let query = new AV.Query(AVStorage);
      query.equalTo('key', key);
      query.find({
        success: function(results) {
          //console.log(results.length);
          let store = results[0];
          if(store == null) store = new AVStorage();
          resolve(store);
        },
        error: function(error) {
          resolve(new AVStorage());
        }
      });
    });    
  }
  /**
   * get content
   * @param  {String} key []
   * @return {Promise}     []
   */
  get(key){
    return new Promise(async (resolve, reject) => {
      let store = await this.getInstance(key);
      let value = store.get('value');
      resolve(value && value.data);
    });
  }
  /**
   * set key content
   * @param {} key     []
   * @param {} content []
   */
  set(key, content){
    return new Promise(async (resolve, reject) => {
      let store = await this.getInstance(key);
      store.set('key', key);
      store.set('value', {data:content});
      store.save({
        success: function(item){
          resolve();
        },
        error: function(post, error) {
          throw new Error(error.message);
        }
      });
    });
  }
  /**
   * delete key
   * @param  {String} key []
   * @return {}     []
   */
  async delete(key){
    let store = await this.getInstance(key);
    return store.destroy();
  }
  /**
   * get all data
   * @return {} []
   */
  list(){
    let AVStorage = Storage.getAVStorage(this.name);
    return new Promise((resolve, reject) => {
      let query = new AV.Query(AVStorage);
      query.find({
        success: function(results) {
          //console.log(results.length);
          var data = {};
          results.forEach(function(store){
            var key = store.get('key');
            var value = store.get('value');
            data[key] = value.data;
          });
          resolve(data);
        },
        error: function(error) {
          resolve({});
        }
      });
    });
  }
}
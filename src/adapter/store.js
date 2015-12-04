'use strict';

let AV = require('avoscloud-sdk');
let crypto = require("crypto");

let sha1 = (str) => require('crypto').createHash('sha1').update(str, 'utf8').digest('hex');

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
    let {name, salt, appid, appkey} = config;
    this.name = name || "ThinkStorage";
    this.salt = salt;
    AV.initialize(appid, appkey);
  }
  getInstance(key){
    let AVStorage = Storage.getAVStorage(this.name);
    return new Promise((resolve, reject) => {
      let query = new AV.Query(AVStorage);
      query.equalTo('key', key);
      query.find({
        success: results => {
          //console.log(results.length);
          let store = results[0];
          if(store == null) store = new AVStorage();
          resolve(store);
        },
        error: error => resolve(new AVStorage())
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
      if(this.salt){
        key = this._encode(key);
      }

      let store = await this.getInstance(key);
      let value = store.get('value');

      if(this.salt && value){
        let data = this._decode(value, key);
        value = JSON.parse(data);
      }

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
      content = {data: content};

      if(this.salt){
        //加密
        key = this._encode(key);
        content = this._encode(JSON.stringify(content), key);
      }
      
      let store = await this.getInstance(key);
      store.set('key', key);
      store.set('value', content);

      store.save({
        success: item => resolve(),
        error: (post, error) => {
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
    if(this.salt){
      key = this._encode(key);
    }

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
        success: results => {
          //console.log(results.length);
          let data = {};
          results.forEach(store => {

            let key = store.get('key');
            let value = store.get('value');

            if(this.salt && value){
              let data = this._decode(value, key);
              value = JSON.parse(data);
            }
            
            if(this.salt){
              key = this._decode(key);
            }

            data[key] = value && value.data;
          });
          resolve(data);
        },
        error: () => resolve({})
      });
    });
  }
  _encode(str, key = ''){
    let ciphter = crypto.createCipheriv('bf', this.salt, sha1(this.salt + key).slice(0, 8));
    let ret = ciphter.update(str,'utf8','hex');
    ret += ciphter.final('hex');
    return ret;
  }
  _decode(str, key = ''){
    let decipher = crypto.createDecipheriv("bf", this.salt, sha1(this.salt + key).slice(0, 8));
    let ret = decipher.update(str, "hex", "utf8");
    ret += decipher.final('utf8');
    return ret;
  }
}
# think-leancloud

store, cache and session by leancloud api.

## Install

```
npm install think-leancloud
```

## How to use

### set config file

```js
//src/common/config.js
'use strict';
/**
 * config
 */
export default {
  //key: value
  leancloud: {
    appid: 'your appid',
    appkey: 'your appkey'
  },
  session: {
    type: 'leancloud',
  }
};
```

### import and register adapters

```js
import LeancloudAdapter from 'think-leancloud';
think.adapter('store', 'leancloud', LeancloudAdapter.Store);
think.adapter('cache', 'leancloud', LeancloudAdapter.Cache);
think.adapter('session', 'leancloud', LeancloudAdapter.Session);
```

### Store

```js
  let Storage = think.adapter('store', 'leancloud');
  let options = this.config('leancloud');
  let store = new Storage(options);

  await store.set('test',{a: 1, b: 2}).catch(err=>{console.log(err)});
  let c = await store.get('test');
  console.log(c);   //{a:1,b:2}
```

### Cache

```js
  let cc = await this.cache('test', {a:1}, {type: 'leancloud'});
  cc = await this.cache('test', undefined, {type: 'leancloud'});
  console.log(cc); //{a:1}
```

### Session

```js
  await this.session('userInfo', {user:'akira-cn'});
  let info = await this.session('userInfo');
  console.log(info);
```


## LICENSE

MIT
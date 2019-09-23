;(function (window) {
  /**
   * @description 调用 schema 的封装
   * @param {string} action 执行动作，必填
   * @param {[object | null | undefined]} data 参数，选填
   * @param {[string | function | null | undefined]} callback 回调函数，选填
   */
  function _invoke (action, data, callback) {
    // console.log('action:', action, 'data:', data, 'callback:', callback);
    if (!action) {
      throw new Error('TypeError: action is required');
    }
    if (typeof action !== 'string') {
      throw new Error('TypeError: action type is error');
    }

    // 处理 callback
    var callbackName = '';
    if (typeof callback === 'string') {
      callbackName = callback;
    } else if (typeof callback === 'function') {
      callbackName = action + Date.now();
      window[callbackName] = callback;
    } else if (callback !== undefined && callback !== null) {
      throw new Error('TypeError: callback type is error');
    }

    // 拼接 schema
    var schema = 'myapp://utils/' + action;
    if (typeof data !== 'object' && typeof data !== 'undefined') {
      throw new Error('TypeError: data type is error');
    }
    if (!data) data = {};
    if (callbackName) data.callback = callbackName; // 给参数对象加上 callback 属性
    var tmpArr = [];
    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        var val = data[key];
        if (typeof val !== 'undefined') {
          tmpArr.push(key + '=' + encodeURIComponent(val));
        }
      }
    }
    var url = tmpArr.join('&');
    if (url) schema += (schema.indexOf('?') === -1 ? '?' : '') + url;

    console.log('schema:', schema);

    // 创建 iframe 进行触发
    var iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = schema;
    var body = document.documentElement.body || document.body;
    body.appendChild(iframe);
    setTimeout(function () {
      body.removeChild(iframe);
      iframe = null;
    }, 10);
  }

  // 暴露全局变量
  window.invoke = {
    share: function (data, callback) {
      _invoke('share', data, callback);
    },
    scan: function (data, callback) {
      _invoke('scan', data, callback);
    },
  };
})(window);

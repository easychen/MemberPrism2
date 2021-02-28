/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@babel/runtime/regenerator/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/@babel/runtime/regenerator/index.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(/*! regenerator-runtime */ "./node_modules/regenerator-runtime/runtime.js");


/***/ }),

/***/ "./node_modules/axios/index.js":
/*!*************************************!*\
  !*** ./node_modules/axios/index.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(/*! ./lib/axios */ "./node_modules/axios/lib/axios.js");

/***/ }),

/***/ "./node_modules/axios/lib/adapters/xhr.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/adapters/xhr.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var settle = __webpack_require__(/*! ./../core/settle */ "./node_modules/axios/lib/core/settle.js");
var cookies = __webpack_require__(/*! ./../helpers/cookies */ "./node_modules/axios/lib/helpers/cookies.js");
var buildURL = __webpack_require__(/*! ./../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var buildFullPath = __webpack_require__(/*! ../core/buildFullPath */ "./node_modules/axios/lib/core/buildFullPath.js");
var parseHeaders = __webpack_require__(/*! ./../helpers/parseHeaders */ "./node_modules/axios/lib/helpers/parseHeaders.js");
var isURLSameOrigin = __webpack_require__(/*! ./../helpers/isURLSameOrigin */ "./node_modules/axios/lib/helpers/isURLSameOrigin.js");
var createError = __webpack_require__(/*! ../core/createError */ "./node_modules/axios/lib/core/createError.js");

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request.onreadystatechange = function handleLoad() {
      if (!request || request.readyState !== 4) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(timeoutErrorMessage, config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (!requestData) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/axios.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/axios.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");
var Axios = __webpack_require__(/*! ./core/Axios */ "./node_modules/axios/lib/core/Axios.js");
var mergeConfig = __webpack_require__(/*! ./core/mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");
var defaults = __webpack_require__(/*! ./defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__(/*! ./cancel/Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");
axios.CancelToken = __webpack_require__(/*! ./cancel/CancelToken */ "./node_modules/axios/lib/cancel/CancelToken.js");
axios.isCancel = __webpack_require__(/*! ./cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(/*! ./helpers/spread */ "./node_modules/axios/lib/helpers/spread.js");

// Expose isAxiosError
axios.isAxiosError = __webpack_require__(/*! ./helpers/isAxiosError */ "./node_modules/axios/lib/helpers/isAxiosError.js");

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/Cancel.js":
/*!*************************************************!*\
  !*** ./node_modules/axios/lib/cancel/Cancel.js ***!
  \*************************************************/
/***/ ((module) => {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/CancelToken.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/cancel/CancelToken.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var Cancel = __webpack_require__(/*! ./Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/isCancel.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/cancel/isCancel.js ***!
  \***************************************************/
/***/ ((module) => {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/Axios.js":
/*!**********************************************!*\
  !*** ./node_modules/axios/lib/core/Axios.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var buildURL = __webpack_require__(/*! ../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var InterceptorManager = __webpack_require__(/*! ./InterceptorManager */ "./node_modules/axios/lib/core/InterceptorManager.js");
var dispatchRequest = __webpack_require__(/*! ./dispatchRequest */ "./node_modules/axios/lib/core/dispatchRequest.js");
var mergeConfig = __webpack_require__(/*! ./mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: (config || {}).data
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),

/***/ "./node_modules/axios/lib/core/InterceptorManager.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/core/InterceptorManager.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),

/***/ "./node_modules/axios/lib/core/buildFullPath.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/buildFullPath.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var isAbsoluteURL = __webpack_require__(/*! ../helpers/isAbsoluteURL */ "./node_modules/axios/lib/helpers/isAbsoluteURL.js");
var combineURLs = __webpack_require__(/*! ../helpers/combineURLs */ "./node_modules/axios/lib/helpers/combineURLs.js");

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/createError.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/createError.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var enhanceError = __webpack_require__(/*! ./enhanceError */ "./node_modules/axios/lib/core/enhanceError.js");

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/dispatchRequest.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/core/dispatchRequest.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var transformData = __webpack_require__(/*! ./transformData */ "./node_modules/axios/lib/core/transformData.js");
var isCancel = __webpack_require__(/*! ../cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");
var defaults = __webpack_require__(/*! ../defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/core/enhanceError.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/core/enhanceError.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code
    };
  };
  return error;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/mergeConfig.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/mergeConfig.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  var valueFromConfig2Keys = ['url', 'method', 'data'];
  var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy', 'params'];
  var defaultToConfig2Keys = [
    'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'timeoutMessage', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'decompress',
    'maxContentLength', 'maxBodyLength', 'maxRedirects', 'transport', 'httpAgent',
    'httpsAgent', 'cancelToken', 'socketPath', 'responseEncoding'
  ];
  var directMergeKeys = ['validateStatus'];

  function getMergedValue(target, source) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge(target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  function mergeDeepProperties(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  }

  utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    }
  });

  utils.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);

  utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  utils.forEach(directMergeKeys, function merge(prop) {
    if (prop in config2) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  var axiosKeys = valueFromConfig2Keys
    .concat(mergeDeepPropertiesKeys)
    .concat(defaultToConfig2Keys)
    .concat(directMergeKeys);

  var otherKeys = Object
    .keys(config1)
    .concat(Object.keys(config2))
    .filter(function filterAxiosKeys(key) {
      return axiosKeys.indexOf(key) === -1;
    });

  utils.forEach(otherKeys, mergeDeepProperties);

  return config;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/settle.js":
/*!***********************************************!*\
  !*** ./node_modules/axios/lib/core/settle.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var createError = __webpack_require__(/*! ./createError */ "./node_modules/axios/lib/core/createError.js");

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),

/***/ "./node_modules/axios/lib/core/transformData.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/transformData.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};


/***/ }),

/***/ "./node_modules/axios/lib/defaults.js":
/*!********************************************!*\
  !*** ./node_modules/axios/lib/defaults.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var process = __webpack_require__(/*! process/browser */ "./node_modules/process/browser.js");


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var normalizeHeaderName = __webpack_require__(/*! ./helpers/normalizeHeaderName */ "./node_modules/axios/lib/helpers/normalizeHeaderName.js");

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(/*! ./adapters/xhr */ "./node_modules/axios/lib/adapters/xhr.js");
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = __webpack_require__(/*! ./adapters/http */ "./node_modules/axios/lib/adapters/xhr.js");
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;


/***/ }),

/***/ "./node_modules/axios/lib/helpers/bind.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/bind.js ***!
  \************************************************/
/***/ ((module) => {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/buildURL.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/buildURL.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/combineURLs.js":
/*!*******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/combineURLs.js ***!
  \*******************************************************/
/***/ ((module) => {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/cookies.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/helpers/cookies.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAbsoluteURL.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAbsoluteURL.js ***!
  \*********************************************************/
/***/ ((module) => {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAxiosError.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAxiosError.js ***!
  \********************************************************/
/***/ ((module) => {

"use strict";


/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
module.exports = function isAxiosError(payload) {
  return (typeof payload === 'object') && (payload.isAxiosError === true);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isURLSameOrigin.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isURLSameOrigin.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/normalizeHeaderName.js":
/*!***************************************************************!*\
  !*** ./node_modules/axios/lib/helpers/normalizeHeaderName.js ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/parseHeaders.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/parseHeaders.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/spread.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/helpers/spread.js ***!
  \**************************************************/
/***/ ((module) => {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/utils.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/utils.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
  if (toString.call(val) !== '[object Object]') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM
};


/***/ }),

/***/ "./src/alpine.min.js":
/*!***************************!*\
  !*** ./src/alpine.min.js ***!
  \***************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* module decorator */ module = __webpack_require__.hmd(module);


function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * Minified by jsDelivr using Terser v5.3.5.
 * Original file: /gh/alpinejs/alpine@2.8.0/dist/alpine.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
!function (e, t) {
  "object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) && "undefined" != "object" ? module.exports = t() : "function" == typeof define && __webpack_require__.amdO ? define(t) : (e = e || self).Alpine = t();
}(undefined, function () {
  "use strict";

  function e(e, t, n) {
    return t in e ? Object.defineProperty(e, t, {
      value: n,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }) : e[t] = n, e;
  }

  function t(e, t) {
    var n = Object.keys(e);

    if (Object.getOwnPropertySymbols) {
      var i = Object.getOwnPropertySymbols(e);
      t && (i = i.filter(function (t) {
        return Object.getOwnPropertyDescriptor(e, t).enumerable;
      })), n.push.apply(n, i);
    }

    return n;
  }

  function n(n) {
    for (var i = 1; i < arguments.length; i++) {
      var r = null != arguments[i] ? arguments[i] : {};
      i % 2 ? t(Object(r), !0).forEach(function (t) {
        e(n, t, r[t]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(r)) : t(Object(r)).forEach(function (e) {
        Object.defineProperty(n, e, Object.getOwnPropertyDescriptor(r, e));
      });
    }

    return n;
  }

  function i(e) {
    return Array.from(new Set(e));
  }

  function r() {
    return navigator.userAgent.includes("Node.js") || navigator.userAgent.includes("jsdom");
  }

  function s(e, t) {
    return e == t;
  }

  function o(e, t) {
    "template" !== e.tagName.toLowerCase() ? console.warn("Alpine: [".concat(t, "] directive should only be added to <template> tags. See https://github.com/alpinejs/alpine#").concat(t)) : 1 !== e.content.childElementCount && console.warn("Alpine: <template> tag with [".concat(t, "] encountered with multiple element roots. Make sure <template> only has a single child element."));
  }

  function a(e) {
    return e.toLowerCase().replace(/-(\w)/g, function (e, t) {
      return t.toUpperCase();
    });
  }

  function l(e, t) {
    if (!1 === t(e)) return;
    var n = e.firstElementChild;

    for (; n;) {
      l(n, t), n = n.nextElementSibling;
    }
  }

  function c(e, t) {
    var n;
    return function () {
      var i = this,
          r = arguments,
          s = function s() {
        n = null, e.apply(i, r);
      };

      clearTimeout(n), n = setTimeout(s, t);
    };
  }

  var u = function u(e, t, n) {
    if (console.warn("Alpine Error: \"".concat(n, "\"\n\nExpression: \"").concat(t, "\"\nElement:"), e), !r()) throw n;
  };

  function d(e, _ref) {
    var t = _ref.el,
        n = _ref.expression;

    try {
      var _i = e();

      return _i instanceof Promise ? _i["catch"](function (e) {
        return u(t, n, e);
      }) : _i;
    } catch (e) {
      u(t, n, e);
    }
  }

  function f(e, t, n) {
    var i = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    return d(function () {
      return "function" == typeof t ? t.call(n) : new Function(["$data"].concat(_toConsumableArray(Object.keys(i))), "var __alpine_result; with($data) { __alpine_result = ".concat(t, " }; return __alpine_result")).apply(void 0, [n].concat(_toConsumableArray(Object.values(i))));
    }, {
      el: e,
      expression: t
    });
  }

  var m = /^x-(on|bind|data|text|html|model|if|for|show|cloak|transition|ref|spread)\b/;

  function p(e) {
    var t = y(e.name);
    return m.test(t);
  }

  function h(e, t, n) {
    var i = Array.from(e.attributes).filter(p).map(v),
        r = i.filter(function (e) {
      return "spread" === e.type;
    })[0];

    if (r) {
      var _n = f(e, r.expression, t.$data);

      i = i.concat(Object.entries(_n).map(function (_ref2) {
        var _ref3 = _slicedToArray(_ref2, 2),
            e = _ref3[0],
            t = _ref3[1];

        return v({
          name: e,
          value: t
        });
      }));
    }

    return n ? i.filter(function (e) {
      return e.type === n;
    }) : function (e) {
      var t = ["bind", "model", "show", "catch-all"];
      return e.sort(function (e, n) {
        var i = -1 === t.indexOf(e.type) ? "catch-all" : e.type,
            r = -1 === t.indexOf(n.type) ? "catch-all" : n.type;
        return t.indexOf(i) - t.indexOf(r);
      });
    }(i);
  }

  function v(_ref4) {
    var e = _ref4.name,
        t = _ref4.value;
    var n = y(e),
        i = n.match(m),
        r = n.match(/:([a-zA-Z0-9\-:]+)/),
        s = n.match(/\.[^.\]]+(?=[^\]]*$)/g) || [];
    return {
      type: i ? i[1] : null,
      value: r ? r[1] : null,
      modifiers: s.map(function (e) {
        return e.replace(".", "");
      }),
      expression: t
    };
  }

  function y(e) {
    return e.startsWith("@") ? e.replace("@", "x-on:") : e.startsWith(":") ? e.replace(":", "x-bind:") : e;
  }

  function b(e) {
    var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Boolean;
    return e.split(" ").filter(t);
  }

  var x = "in",
      g = "out",
      _ = "cancelled";

  function w(e, t, n, i) {
    var r = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : !1;
    if (r) return t();
    if (e.__x_transition && e.__x_transition.type === x) return;
    var s = h(e, i, "transition"),
        o = h(e, i, "show")[0];

    if (o && o.modifiers.includes("transition")) {
      var _i2 = o.modifiers;
      if (_i2.includes("out") && !_i2.includes("in")) return t();

      var _r = _i2.includes("in") && _i2.includes("out");

      _i2 = _r ? _i2.filter(function (e, t) {
        return t < _i2.indexOf("out");
      }) : _i2, function (e, t, n, i) {
        var r = {
          duration: O(t, "duration", 150),
          origin: O(t, "origin", "center"),
          first: {
            opacity: 0,
            scale: O(t, "scale", 95)
          },
          second: {
            opacity: 1,
            scale: 100
          }
        };
        k(e, t, n, function () {}, i, r, x);
      }(e, _i2, t, n);
    } else s.some(function (e) {
      return ["enter", "enter-start", "enter-end"].includes(e.value);
    }) ? function (e, t, n, i, r) {
      var s = b(A((n.find(function (e) {
        return "enter" === e.value;
      }) || {
        expression: ""
      }).expression, e, t)),
          o = b(A((n.find(function (e) {
        return "enter-start" === e.value;
      }) || {
        expression: ""
      }).expression, e, t)),
          a = b(A((n.find(function (e) {
        return "enter-end" === e.value;
      }) || {
        expression: ""
      }).expression, e, t));
      S(e, s, o, a, i, function () {}, x, r);
    }(e, i, s, t, n) : t();
  }

  function E(e, t, n, i) {
    var r = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : !1;
    if (r) return t();
    if (e.__x_transition && e.__x_transition.type === g) return;
    var s = h(e, i, "transition"),
        o = h(e, i, "show")[0];

    if (o && o.modifiers.includes("transition")) {
      var _i3 = o.modifiers;
      if (_i3.includes("in") && !_i3.includes("out")) return t();

      var _r2 = _i3.includes("in") && _i3.includes("out");

      _i3 = _r2 ? _i3.filter(function (e, t) {
        return t > _i3.indexOf("out");
      }) : _i3, function (e, t, n, i, r) {
        var s = {
          duration: n ? O(t, "duration", 150) : O(t, "duration", 150) / 2,
          origin: O(t, "origin", "center"),
          first: {
            opacity: 1,
            scale: 100
          },
          second: {
            opacity: 0,
            scale: O(t, "scale", 95)
          }
        };
        k(e, t, function () {}, i, r, s, g);
      }(e, _i3, _r2, t, n);
    } else s.some(function (e) {
      return ["leave", "leave-start", "leave-end"].includes(e.value);
    }) ? function (e, t, n, i, r) {
      var s = b(A((n.find(function (e) {
        return "leave" === e.value;
      }) || {
        expression: ""
      }).expression, e, t)),
          o = b(A((n.find(function (e) {
        return "leave-start" === e.value;
      }) || {
        expression: ""
      }).expression, e, t)),
          a = b(A((n.find(function (e) {
        return "leave-end" === e.value;
      }) || {
        expression: ""
      }).expression, e, t));
      S(e, s, o, a, function () {}, i, g, r);
    }(e, i, s, t, n) : t();
  }

  function O(e, t, n) {
    if (-1 === e.indexOf(t)) return n;
    var i = e[e.indexOf(t) + 1];
    if (!i) return n;
    if ("scale" === t && !P(i)) return n;

    if ("duration" === t) {
      var _e2 = i.match(/([0-9]+)ms/);

      if (_e2) return _e2[1];
    }

    return "origin" === t && ["top", "right", "left", "center", "bottom"].includes(e[e.indexOf(t) + 2]) ? [i, e[e.indexOf(t) + 2]].join(" ") : i;
  }

  function k(e, t, n, i, r, s, o) {
    e.__x_transition && e.__x_transition.cancel && e.__x_transition.cancel();
    var a = e.style.opacity,
        l = e.style.transform,
        c = e.style.transformOrigin,
        u = !t.includes("opacity") && !t.includes("scale"),
        d = u || t.includes("opacity"),
        f = u || t.includes("scale"),
        m = {
      start: function start() {
        d && (e.style.opacity = s.first.opacity), f && (e.style.transform = "scale(".concat(s.first.scale / 100, ")"));
      },
      during: function during() {
        f && (e.style.transformOrigin = s.origin), e.style.transitionProperty = [d ? "opacity" : "", f ? "transform" : ""].join(" ").trim(), e.style.transitionDuration = s.duration / 1e3 + "s", e.style.transitionTimingFunction = "cubic-bezier(0.4, 0.0, 0.2, 1)";
      },
      show: function show() {
        n();
      },
      end: function end() {
        d && (e.style.opacity = s.second.opacity), f && (e.style.transform = "scale(".concat(s.second.scale / 100, ")"));
      },
      hide: function hide() {
        i();
      },
      cleanup: function cleanup() {
        d && (e.style.opacity = a), f && (e.style.transform = l), f && (e.style.transformOrigin = c), e.style.transitionProperty = null, e.style.transitionDuration = null, e.style.transitionTimingFunction = null;
      }
    };
    $(e, m, o, r);
  }

  var A = function A(e, t, n) {
    return "function" == typeof e ? n.evaluateReturnExpression(t, e) : e;
  };

  function S(e, t, n, i, r, s, o, a) {
    e.__x_transition && e.__x_transition.cancel && e.__x_transition.cancel();
    var l = e.__x_original_classes || [],
        c = {
      start: function start() {
        var _e$classList;

        (_e$classList = e.classList).add.apply(_e$classList, _toConsumableArray(n));
      },
      during: function during() {
        var _e$classList2;

        (_e$classList2 = e.classList).add.apply(_e$classList2, _toConsumableArray(t));
      },
      show: function show() {
        r();
      },
      end: function end() {
        var _e$classList3, _e$classList4;

        (_e$classList3 = e.classList).remove.apply(_e$classList3, _toConsumableArray(n.filter(function (e) {
          return !l.includes(e);
        }))), (_e$classList4 = e.classList).add.apply(_e$classList4, _toConsumableArray(i));
      },
      hide: function hide() {
        s();
      },
      cleanup: function cleanup() {
        var _e$classList5, _e$classList6;

        (_e$classList5 = e.classList).remove.apply(_e$classList5, _toConsumableArray(t.filter(function (e) {
          return !l.includes(e);
        }))), (_e$classList6 = e.classList).remove.apply(_e$classList6, _toConsumableArray(i.filter(function (e) {
          return !l.includes(e);
        })));
      }
    };
    $(e, c, o, a);
  }

  function $(e, t, n, i) {
    var r = C(function () {
      t.hide(), e.isConnected && t.cleanup(), delete e.__x_transition;
    });
    e.__x_transition = {
      type: n,
      cancel: C(function () {
        i(_), r();
      }),
      finish: r,
      nextFrame: null
    }, t.start(), t.during(), e.__x_transition.nextFrame = requestAnimationFrame(function () {
      var n = 1e3 * Number(getComputedStyle(e).transitionDuration.replace(/,.*/, "").replace("s", ""));
      0 === n && (n = 1e3 * Number(getComputedStyle(e).animationDuration.replace("s", ""))), t.show(), e.__x_transition.nextFrame = requestAnimationFrame(function () {
        t.end(), setTimeout(e.__x_transition.finish, n);
      });
    });
  }

  function P(e) {
    return !Array.isArray(e) && !isNaN(e);
  }

  function C(e) {
    var t = !1;
    return function () {
      t || (t = !0, e.apply(this, arguments));
    };
  }

  function D(e, t, i, r, s) {
    o(t, "x-for");

    var a = j("function" == typeof i ? e.evaluateReturnExpression(t, i) : i),
        l = function (e, t, n, i) {
      var r = h(t, e, "if")[0];
      if (r && !e.evaluateReturnExpression(t, r.expression)) return [];
      var s = e.evaluateReturnExpression(t, n.items, i);
      P(s) && s > 0 && (s = Array.from(Array(s).keys(), function (e) {
        return e + 1;
      }));
      return s;
    }(e, t, a, s),
        c = t;

    l.forEach(function (i, o) {
      var u = function (e, t, i, r, s) {
        var o = s ? n({}, s) : {};
        o[e.item] = t, e.index && (o[e.index] = i);
        e.collection && (o[e.collection] = r);
        return o;
      }(a, i, o, l, s()),
          d = function (e, t, n, i) {
        var r = h(t, e, "bind").filter(function (e) {
          return "key" === e.value;
        })[0];
        return r ? e.evaluateReturnExpression(t, r.expression, function () {
          return i;
        }) : n;
      }(e, t, o, u),
          f = function (e, t) {
        if (!e) return;
        if (void 0 === e.__x_for_key) return;
        if (e.__x_for_key === t) return e;
        var n = e;

        for (; n;) {
          if (n.__x_for_key === t) return n.parentElement.insertBefore(n, e);
          n = !(!n.nextElementSibling || void 0 === n.nextElementSibling.__x_for_key) && n.nextElementSibling;
        }
      }(c.nextElementSibling, d);

      f ? (delete f.__x_for_key, f.__x_for = u, e.updateElements(f, function () {
        return f.__x_for;
      })) : (f = function (e, t) {
        var n = document.importNode(e.content, !0);
        return t.parentElement.insertBefore(n, t.nextElementSibling), t.nextElementSibling;
      }(t, c), w(f, function () {}, function () {}, e, r), f.__x_for = u, e.initializeElements(f, function () {
        return f.__x_for;
      })), c = f, c.__x_for_key = d;
    }), function (e, t) {
      var n = !(!e.nextElementSibling || void 0 === e.nextElementSibling.__x_for_key) && e.nextElementSibling;

      var _loop = function _loop() {
        var e = n,
            i = n.nextElementSibling;
        E(n, function () {
          e.remove();
        }, function () {}, t), n = !(!i || void 0 === i.__x_for_key) && i;
      };

      for (; n;) {
        _loop();
      }
    }(c, e);
  }

  function j(e) {
    var t = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/,
        n = e.match(/([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/);
    if (!n) return;
    var i = {};
    i.items = n[2].trim();
    var r = n[1].trim().replace(/^\(|\)$/g, ""),
        s = r.match(t);
    return s ? (i.item = r.replace(t, "").trim(), i.index = s[1].trim(), s[2] && (i.collection = s[2].trim())) : i.item = r, i;
  }

  function T(e, t, n, r, o, l, c) {
    var u = e.evaluateReturnExpression(t, r, o);

    if ("value" === n) {
      if (xe.ignoreFocusedForValueBinding && document.activeElement.isSameNode(t)) return;
      if (void 0 === u && r.match(/\./) && (u = ""), "radio" === t.type) void 0 === t.attributes.value && "bind" === l ? t.value = u : "bind" !== l && (t.checked = s(t.value, u));else if ("checkbox" === t.type) "boolean" == typeof u || [null, void 0].includes(u) || "bind" !== l ? "bind" !== l && (Array.isArray(u) ? t.checked = u.some(function (e) {
        return s(e, t.value);
      }) : t.checked = !!u) : t.value = String(u);else if ("SELECT" === t.tagName) !function (e, t) {
        var n = [].concat(t).map(function (e) {
          return e + "";
        });
        Array.from(e.options).forEach(function (e) {
          e.selected = n.includes(e.value || e.text);
        });
      }(t, u);else {
        if (t.value === u) return;
        t.value = u;
      }
    } else if ("class" === n) {
      if (Array.isArray(u)) {
        var _e3 = t.__x_original_classes || [];

        t.setAttribute("class", i(_e3.concat(u)).join(" "));
      } else if ("object" == _typeof(u)) {
        Object.keys(u).sort(function (e, t) {
          return u[e] - u[t];
        }).forEach(function (e) {
          u[e] ? b(e).forEach(function (e) {
            return t.classList.add(e);
          }) : b(e).forEach(function (e) {
            return t.classList.remove(e);
          });
        });
      } else {
        var _e4 = t.__x_original_classes || [],
            _n2 = u ? b(u) : [];

        t.setAttribute("class", i(_e4.concat(_n2)).join(" "));
      }
    } else n = c.includes("camel") ? a(n) : n, [null, void 0, !1].includes(u) ? t.removeAttribute(n) : !function (e) {
      return ["disabled", "checked", "required", "readonly", "hidden", "open", "selected", "autofocus", "itemscope", "multiple", "novalidate", "allowfullscreen", "allowpaymentrequest", "formnovalidate", "autoplay", "controls", "loop", "muted", "playsinline", "default", "ismap", "reversed", "async", "defer", "nomodule"].includes(e);
    }(n) ? L(t, n, u) : L(t, n, n);
  }

  function L(e, t, n) {
    e.getAttribute(t) != n && e.setAttribute(t, n);
  }

  function N(e, t, n, i, r) {
    var s = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
    var o = {
      passive: i.includes("passive")
    };

    if (i.includes("camel") && (n = a(n)), i.includes("away")) {
      var _a = function _a(l) {
        t.contains(l.target) || t.offsetWidth < 1 && t.offsetHeight < 1 || (z(e, r, l, s), i.includes("once") && document.removeEventListener(n, _a, o));
      };

      document.addEventListener(n, _a, o);
    } else {
      var _a2 = i.includes("window") ? window : i.includes("document") ? document : t,
          _l2 = function _l(c) {
        if (_a2 !== window && _a2 !== document || document.body.contains(t)) {
          if (!(function (e) {
            return ["keydown", "keyup"].includes(e);
          }(n) && function (e, t) {
            var n = t.filter(function (e) {
              return !["window", "document", "prevent", "stop"].includes(e);
            });

            if (n.includes("debounce")) {
              var _e5 = n.indexOf("debounce");

              n.splice(_e5, P((n[_e5 + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
            }

            if (0 === n.length) return !1;
            if (1 === n.length && n[0] === R(e.key)) return !1;
            var i = ["ctrl", "shift", "alt", "meta", "cmd", "super"].filter(function (e) {
              return n.includes(e);
            });

            if (n = n.filter(function (e) {
              return !i.includes(e);
            }), i.length > 0) {
              if (i.filter(function (t) {
                return "cmd" !== t && "super" !== t || (t = "meta"), e[t + "Key"];
              }).length === i.length && n[0] === R(e.key)) return !1;
            }

            return !0;
          }(c, i) || (i.includes("prevent") && c.preventDefault(), i.includes("stop") && c.stopPropagation(), i.includes("self") && c.target !== t))) {
            z(e, r, c, s).then(function (e) {
              !1 === e ? c.preventDefault() : i.includes("once") && _a2.removeEventListener(n, _l2, o);
            });
          }
        } else _a2.removeEventListener(n, _l2, o);
      };

      if (i.includes("debounce")) {
        var _e6 = i[i.indexOf("debounce") + 1] || "invalid-wait",
            _t = P(_e6.split("ms")[0]) ? Number(_e6.split("ms")[0]) : 250;

        _l2 = c(_l2, _t);
      }

      _a2.addEventListener(n, _l2, o);
    }
  }

  function z(e, t, i, r) {
    return e.evaluateCommandExpression(i.target, t, function () {
      return n(n({}, r()), {}, {
        $event: i
      });
    });
  }

  function R(e) {
    switch (e) {
      case "/":
        return "slash";

      case " ":
      case "Spacebar":
        return "space";

      default:
        return e && e.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[_\s]/, "-").toLowerCase();
    }
  }

  function F(e, t, n) {
    return "radio" === e.type && (e.hasAttribute("name") || e.setAttribute("name", n)), function (n, i) {
      if (n instanceof CustomEvent && n.detail) return n.detail;

      if ("checkbox" === e.type) {
        if (Array.isArray(i)) {
          var _e7 = t.includes("number") ? I(n.target.value) : n.target.value;

          return n.target.checked ? i.concat([_e7]) : i.filter(function (t) {
            return !s(t, _e7);
          });
        }

        return n.target.checked;
      }

      if ("select" === e.tagName.toLowerCase() && e.multiple) return t.includes("number") ? Array.from(n.target.selectedOptions).map(function (e) {
        return I(e.value || e.text);
      }) : Array.from(n.target.selectedOptions).map(function (e) {
        return e.value || e.text;
      });
      {
        var _e8 = n.target.value;
        return t.includes("number") ? I(_e8) : t.includes("trim") ? _e8.trim() : _e8;
      }
    };
  }

  function I(e) {
    var t = e ? parseFloat(e) : null;
    return P(t) ? t : e;
  }

  var M = Array.isArray,
      B = Object.getPrototypeOf,
      q = Object.create,
      U = Object.defineProperty,
      W = Object.defineProperties,
      K = Object.isExtensible,
      G = Object.getOwnPropertyDescriptor,
      H = Object.getOwnPropertyNames,
      V = Object.getOwnPropertySymbols,
      Z = Object.preventExtensions,
      J = Object.hasOwnProperty,
      _Array$prototype = Array.prototype,
      Q = _Array$prototype.push,
      X = _Array$prototype.concat,
      Y = _Array$prototype.map;

  function ee(e) {
    return void 0 === e;
  }

  function te(e) {
    return "function" == typeof e;
  }

  var ne = new WeakMap();

  function ie(e, t) {
    ne.set(e, t);
  }

  var re = function re(e) {
    return ne.get(e) || e;
  };

  function se(e, t) {
    return e.valueIsObservable(t) ? e.getProxy(t) : t;
  }

  function oe(e, t, n) {
    X.call(H(n), V(n)).forEach(function (i) {
      var r = G(n, i);
      r.configurable || (r = ve(e, r, se)), U(t, i, r);
    }), Z(t);
  }

  var ae = /*#__PURE__*/function () {
    function ae(e, t) {
      _classCallCheck(this, ae);

      this.originalTarget = t, this.membrane = e;
    }

    _createClass(ae, [{
      key: "get",
      value: function get(e, t) {
        var n = this.originalTarget,
            i = this.membrane,
            r = n[t],
            s = i.valueObserved;
        return s(n, t), i.getProxy(r);
      }
    }, {
      key: "set",
      value: function set(e, t, n) {
        var i = this.originalTarget,
            r = this.membrane.valueMutated;
        return i[t] !== n ? (i[t] = n, r(i, t)) : "length" === t && M(i) && r(i, t), !0;
      }
    }, {
      key: "deleteProperty",
      value: function deleteProperty(e, t) {
        var n = this.originalTarget,
            i = this.membrane.valueMutated;
        return delete n[t], i(n, t), !0;
      }
    }, {
      key: "apply",
      value: function apply(e, t, n) {}
    }, {
      key: "construct",
      value: function construct(e, t, n) {}
    }, {
      key: "has",
      value: function has(e, t) {
        var n = this.originalTarget,
            i = this.membrane.valueObserved;
        return i(n, t), t in n;
      }
    }, {
      key: "ownKeys",
      value: function ownKeys(e) {
        var t = this.originalTarget;
        return X.call(H(t), V(t));
      }
    }, {
      key: "isExtensible",
      value: function isExtensible(e) {
        var t = K(e);
        if (!t) return t;
        var n = this.originalTarget,
            i = this.membrane,
            r = K(n);
        return r || oe(i, e, n), r;
      }
    }, {
      key: "setPrototypeOf",
      value: function setPrototypeOf(e, t) {}
    }, {
      key: "getPrototypeOf",
      value: function getPrototypeOf(e) {
        var t = this.originalTarget;
        return B(t);
      }
    }, {
      key: "getOwnPropertyDescriptor",
      value: function getOwnPropertyDescriptor(e, t) {
        var n = this.originalTarget,
            i = this.membrane,
            r = this.membrane.valueObserved;
        r(n, t);
        var s = G(n, t);
        if (ee(s)) return s;
        var o = G(e, t);
        return ee(o) ? (s = ve(i, s, se), s.configurable || U(e, t, s), s) : o;
      }
    }, {
      key: "preventExtensions",
      value: function preventExtensions(e) {
        var t = this.originalTarget,
            n = this.membrane;
        return oe(n, e, t), Z(t), !0;
      }
    }, {
      key: "defineProperty",
      value: function defineProperty(e, t, n) {
        var i = this.originalTarget,
            r = this.membrane,
            s = r.valueMutated,
            o = n.configurable;

        if (J.call(n, "writable") && !J.call(n, "value")) {
          var _e9 = G(i, t);

          n.value = _e9.value;
        }

        return U(i, t, function (e) {
          return J.call(e, "value") && (e.value = re(e.value)), e;
        }(n)), !1 === o && U(e, t, ve(r, n, se)), s(i, t), !0;
      }
    }]);

    return ae;
  }();

  function le(e, t) {
    return e.valueIsObservable(t) ? e.getReadOnlyProxy(t) : t;
  }

  var ce = /*#__PURE__*/function () {
    function ce(e, t) {
      _classCallCheck(this, ce);

      this.originalTarget = t, this.membrane = e;
    }

    _createClass(ce, [{
      key: "get",
      value: function get(e, t) {
        var n = this.membrane,
            i = this.originalTarget,
            r = i[t],
            s = n.valueObserved;
        return s(i, t), n.getReadOnlyProxy(r);
      }
    }, {
      key: "set",
      value: function set(e, t, n) {
        return !1;
      }
    }, {
      key: "deleteProperty",
      value: function deleteProperty(e, t) {
        return !1;
      }
    }, {
      key: "apply",
      value: function apply(e, t, n) {}
    }, {
      key: "construct",
      value: function construct(e, t, n) {}
    }, {
      key: "has",
      value: function has(e, t) {
        var n = this.originalTarget,
            i = this.membrane.valueObserved;
        return i(n, t), t in n;
      }
    }, {
      key: "ownKeys",
      value: function ownKeys(e) {
        var t = this.originalTarget;
        return X.call(H(t), V(t));
      }
    }, {
      key: "setPrototypeOf",
      value: function setPrototypeOf(e, t) {}
    }, {
      key: "getOwnPropertyDescriptor",
      value: function getOwnPropertyDescriptor(e, t) {
        var n = this.originalTarget,
            i = this.membrane,
            r = i.valueObserved;
        r(n, t);
        var s = G(n, t);
        if (ee(s)) return s;
        var o = G(e, t);
        return ee(o) ? (s = ve(i, s, le), J.call(s, "set") && (s.set = void 0), s.configurable || U(e, t, s), s) : o;
      }
    }, {
      key: "preventExtensions",
      value: function preventExtensions(e) {
        return !1;
      }
    }, {
      key: "defineProperty",
      value: function defineProperty(e, t, n) {
        return !1;
      }
    }]);

    return ce;
  }();

  function ue(e) {
    var t = void 0;
    return M(e) ? t = [] : "object" == _typeof(e) && (t = {}), t;
  }

  var de = Object.prototype;

  function fe(e) {
    if (null === e) return !1;
    if ("object" != _typeof(e)) return !1;
    if (M(e)) return !0;
    var t = B(e);
    return t === de || null === t || null === B(t);
  }

  var me = function me(e, t) {},
      pe = function pe(e, t) {},
      he = function he(e) {
    return e;
  };

  function ve(e, t, n) {
    var i = t.set,
        r = t.get;
    return J.call(t, "value") ? t.value = n(e, t.value) : (ee(r) || (t.get = function () {
      return n(e, r.call(re(this)));
    }), ee(i) || (t.set = function (t) {
      i.call(re(this), e.unwrapProxy(t));
    })), t;
  }

  var ye = /*#__PURE__*/function () {
    function ye(e) {
      _classCallCheck(this, ye);

      if (this.valueDistortion = he, this.valueMutated = pe, this.valueObserved = me, this.valueIsObservable = fe, this.objectGraph = new WeakMap(), !ee(e)) {
        var _t2 = e.valueDistortion,
            _n3 = e.valueMutated,
            _i4 = e.valueObserved,
            _r3 = e.valueIsObservable;
        this.valueDistortion = te(_t2) ? _t2 : he, this.valueMutated = te(_n3) ? _n3 : pe, this.valueObserved = te(_i4) ? _i4 : me, this.valueIsObservable = te(_r3) ? _r3 : fe;
      }
    }

    _createClass(ye, [{
      key: "getProxy",
      value: function getProxy(e) {
        var t = re(e),
            n = this.valueDistortion(t);

        if (this.valueIsObservable(n)) {
          var _i5 = this.getReactiveState(t, n);

          return _i5.readOnly === e ? e : _i5.reactive;
        }

        return n;
      }
    }, {
      key: "getReadOnlyProxy",
      value: function getReadOnlyProxy(e) {
        e = re(e);
        var t = this.valueDistortion(e);
        return this.valueIsObservable(t) ? this.getReactiveState(e, t).readOnly : t;
      }
    }, {
      key: "unwrapProxy",
      value: function unwrapProxy(e) {
        return re(e);
      }
    }, {
      key: "getReactiveState",
      value: function getReactiveState(e, t) {
        var n = this.objectGraph;
        var i = n.get(t);
        if (i) return i;
        var r = this;
        return i = {
          get reactive() {
            var n = new ae(r, t),
                i = new Proxy(ue(t), n);
            return ie(i, e), U(this, "reactive", {
              value: i
            }), i;
          },

          get readOnly() {
            var n = new ce(r, t),
                i = new Proxy(ue(t), n);
            return ie(i, e), U(this, "readOnly", {
              value: i
            }), i;
          }

        }, n.set(t, i), i;
      }
    }]);

    return ye;
  }();

  var be = /*#__PURE__*/function () {
    function be(e) {
      var _this = this;

      var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      _classCallCheck(this, be);

      this.$el = e;
      var n = this.$el.getAttribute("x-data"),
          i = "" === n ? "{}" : n,
          r = this.$el.getAttribute("x-init");
      var s = {
        $el: this.$el
      },
          o = t ? t.$el : this.$el;
      Object.entries(xe.magicProperties).forEach(function (_ref5) {
        var _ref6 = _slicedToArray(_ref5, 2),
            e = _ref6[0],
            t = _ref6[1];

        Object.defineProperty(s, "$" + e, {
          get: function get() {
            return t(o);
          }
        });
      }), this.unobservedData = t ? t.getUnobservedData() : f(e, i, s);

      var _this$wrapDataInObser = this.wrapDataInObservable(this.unobservedData),
          a = _this$wrapDataInObser.membrane,
          l = _this$wrapDataInObser.data;

      var c;
      this.$data = l, this.membrane = a, this.unobservedData.$el = this.$el, this.unobservedData.$refs = this.getRefsProxy(), this.nextTickStack = [], this.unobservedData.$nextTick = function (e) {
        _this.nextTickStack.push(e);
      }, this.watchers = {}, this.unobservedData.$watch = function (e, t) {
        _this.watchers[e] || (_this.watchers[e] = []), _this.watchers[e].push(t);
      }, Object.entries(xe.magicProperties).forEach(function (_ref7) {
        var _ref8 = _slicedToArray(_ref7, 2),
            e = _ref8[0],
            t = _ref8[1];

        Object.defineProperty(_this.unobservedData, "$" + e, {
          get: function get() {
            return t(o, this.$el);
          }
        });
      }), this.showDirectiveStack = [], this.showDirectiveLastElement, t || xe.onBeforeComponentInitializeds.forEach(function (e) {
        return e(_this);
      }), r && !t && (this.pauseReactivity = !0, c = this.evaluateReturnExpression(this.$el, r), this.pauseReactivity = !1), this.initializeElements(this.$el), this.listenForNewElementsToInitialize(), "function" == typeof c && c.call(this.$data), t || setTimeout(function () {
        xe.onComponentInitializeds.forEach(function (e) {
          return e(_this);
        });
      }, 0);
    }

    _createClass(be, [{
      key: "getUnobservedData",
      value: function getUnobservedData() {
        return function (e, t) {
          var n = e.unwrapProxy(t),
              i = {};
          return Object.keys(n).forEach(function (e) {
            ["$el", "$refs", "$nextTick", "$watch"].includes(e) || (i[e] = n[e]);
          }), i;
        }(this.membrane, this.$data);
      }
    }, {
      key: "wrapDataInObservable",
      value: function wrapDataInObservable(e) {
        var t = this;
        var n = c(function () {
          t.updateElements(t.$el);
        }, 0);
        return function (e, t) {
          var n = new ye({
            valueMutated: function valueMutated(e, n) {
              t(e, n);
            }
          });
          return {
            data: n.getProxy(e),
            membrane: n
          };
        }(e, function (e, i) {
          t.watchers[i] ? t.watchers[i].forEach(function (t) {
            return t(e[i]);
          }) : Array.isArray(e) ? Object.keys(t.watchers).forEach(function (n) {
            var r = n.split(".");
            "length" !== i && r.reduce(function (i, r) {
              return Object.is(e, i[r]) && t.watchers[n].forEach(function (t) {
                return t(e);
              }), i[r];
            }, t.unobservedData);
          }) : Object.keys(t.watchers).filter(function (e) {
            return e.includes(".");
          }).forEach(function (n) {
            var r = n.split(".");
            i === r[r.length - 1] && r.reduce(function (r, s) {
              return Object.is(e, r) && t.watchers[n].forEach(function (t) {
                return t(e[i]);
              }), r[s];
            }, t.unobservedData);
          }), t.pauseReactivity || n();
        });
      }
    }, {
      key: "walkAndSkipNestedComponents",
      value: function walkAndSkipNestedComponents(e, t) {
        var _this2 = this;

        var n = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};
        l(e, function (e) {
          return e.hasAttribute("x-data") && !e.isSameNode(_this2.$el) ? (e.__x || n(e), !1) : t(e);
        });
      }
    }, {
      key: "initializeElements",
      value: function initializeElements(e) {
        var _this3 = this;

        var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};
        this.walkAndSkipNestedComponents(e, function (e) {
          return void 0 === e.__x_for_key && void 0 === e.__x_inserted_me && void _this3.initializeElement(e, t);
        }, function (e) {
          e.__x = new be(e);
        }), this.executeAndClearRemainingShowDirectiveStack(), this.executeAndClearNextTickStack(e);
      }
    }, {
      key: "initializeElement",
      value: function initializeElement(e, t) {
        e.hasAttribute("class") && h(e, this).length > 0 && (e.__x_original_classes = b(e.getAttribute("class"))), this.registerListeners(e, t), this.resolveBoundAttributes(e, !0, t);
      }
    }, {
      key: "updateElements",
      value: function updateElements(e) {
        var _this4 = this;

        var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};
        this.walkAndSkipNestedComponents(e, function (e) {
          if (void 0 !== e.__x_for_key && !e.isSameNode(_this4.$el)) return !1;

          _this4.updateElement(e, t);
        }, function (e) {
          e.__x = new be(e);
        }), this.executeAndClearRemainingShowDirectiveStack(), this.executeAndClearNextTickStack(e);
      }
    }, {
      key: "executeAndClearNextTickStack",
      value: function executeAndClearNextTickStack(e) {
        var _this5 = this;

        e === this.$el && this.nextTickStack.length > 0 && requestAnimationFrame(function () {
          for (; _this5.nextTickStack.length > 0;) {
            _this5.nextTickStack.shift()();
          }
        });
      }
    }, {
      key: "executeAndClearRemainingShowDirectiveStack",
      value: function executeAndClearRemainingShowDirectiveStack() {
        this.showDirectiveStack.reverse().map(function (e) {
          return new Promise(function (t, n) {
            e(t, n);
          });
        }).reduce(function (e, t) {
          return e.then(function () {
            return t.then(function (e) {
              e();
            });
          });
        }, Promise.resolve(function () {}))["catch"](function (e) {
          if (e !== _) throw e;
        }), this.showDirectiveStack = [], this.showDirectiveLastElement = void 0;
      }
    }, {
      key: "updateElement",
      value: function updateElement(e, t) {
        this.resolveBoundAttributes(e, !1, t);
      }
    }, {
      key: "registerListeners",
      value: function registerListeners(e, t) {
        var _this6 = this;

        h(e, this).forEach(function (_ref9) {
          var i = _ref9.type,
              r = _ref9.value,
              s = _ref9.modifiers,
              o = _ref9.expression;

          switch (i) {
            case "on":
              N(_this6, e, r, s, o, t);
              break;

            case "model":
              !function (e, t, i, r, s) {
                var o = "select" === t.tagName.toLowerCase() || ["checkbox", "radio"].includes(t.type) || i.includes("lazy") ? "change" : "input";
                N(e, t, o, i, "".concat(r, " = rightSideOfExpression($event, ").concat(r, ")"), function () {
                  return n(n({}, s()), {}, {
                    rightSideOfExpression: F(t, i, r)
                  });
                });
              }(_this6, e, s, o, t);
          }
        });
      }
    }, {
      key: "resolveBoundAttributes",
      value: function resolveBoundAttributes(e) {
        var _this7 = this;

        var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : !1;
        var n = arguments.length > 2 ? arguments[2] : undefined;
        var i = h(e, this);
        i.forEach(function (_ref10) {
          var r = _ref10.type,
              s = _ref10.value,
              a = _ref10.modifiers,
              l = _ref10.expression;

          switch (r) {
            case "model":
              T(_this7, e, "value", l, n, r, a);
              break;

            case "bind":
              if ("template" === e.tagName.toLowerCase() && "key" === s) return;
              T(_this7, e, s, l, n, r, a);
              break;

            case "text":
              var c = _this7.evaluateReturnExpression(e, l, n);

              !function (e, t, n) {
                void 0 === t && n.match(/\./) && (t = ""), e.textContent = t;
              }(e, c, l);
              break;

            case "html":
              !function (e, t, n, i) {
                t.innerHTML = e.evaluateReturnExpression(t, n, i);
              }(_this7, e, l, n);
              break;

            case "show":
              c = _this7.evaluateReturnExpression(e, l, n);
              !function (e, t, n, i) {
                var r = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : !1;

                var s = function s() {
                  t.style.display = "none", t.__x_is_shown = !1;
                },
                    o = function o() {
                  1 === t.style.length && "none" === t.style.display ? t.removeAttribute("style") : t.style.removeProperty("display"), t.__x_is_shown = !0;
                };

                if (!0 === r) return void (n ? o() : s());

                var a = function a(i, r) {
                  n ? (("none" === t.style.display || t.__x_transition) && w(t, function () {
                    o();
                  }, r, e), i(function () {})) : "none" !== t.style.display ? E(t, function () {
                    i(function () {
                      s();
                    });
                  }, r, e) : i(function () {});
                };

                i.includes("immediate") ? a(function (e) {
                  return e();
                }, function () {}) : (e.showDirectiveLastElement && !e.showDirectiveLastElement.contains(t) && e.executeAndClearRemainingShowDirectiveStack(), e.showDirectiveStack.push(a), e.showDirectiveLastElement = t);
              }(_this7, e, c, a, t);
              break;

            case "if":
              if (i.some(function (e) {
                return "for" === e.type;
              })) return;
              c = _this7.evaluateReturnExpression(e, l, n);
              !function (e, t, n, i, r) {
                o(t, "x-if");
                var s = t.nextElementSibling && !0 === t.nextElementSibling.__x_inserted_me;
                if (!n || s && !t.__x_transition) !n && s && E(t.nextElementSibling, function () {
                  t.nextElementSibling.remove();
                }, function () {}, e, i);else {
                  var _n4 = document.importNode(t.content, !0);

                  t.parentElement.insertBefore(_n4, t.nextElementSibling), w(t.nextElementSibling, function () {}, function () {}, e, i), e.initializeElements(t.nextElementSibling, r), t.nextElementSibling.__x_inserted_me = !0;
                }
              }(_this7, e, c, t, n);
              break;

            case "for":
              D(_this7, e, l, t, n);
              break;

            case "cloak":
              e.removeAttribute("x-cloak");
          }
        });
      }
    }, {
      key: "evaluateReturnExpression",
      value: function evaluateReturnExpression(e, t) {
        var i = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};
        return f(e, t, this.$data, n(n({}, i()), {}, {
          $dispatch: this.getDispatchFunction(e)
        }));
      }
    }, {
      key: "evaluateCommandExpression",
      value: function evaluateCommandExpression(e, t) {
        var i = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};
        return function (e, t, n) {
          var i = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
          return d(function () {
            if ("function" == typeof t) return Promise.resolve(t.call(n, i.$event));
            var e = Function;

            if (e = Object.getPrototypeOf( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee() {
              return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                    case "end":
                      return _context.stop();
                  }
                }
              }, _callee);
            }))).constructor, Object.keys(n).includes(t)) {
              var _e10 = new Function(["dataContext"].concat(_toConsumableArray(Object.keys(i))), "with(dataContext) { return ".concat(t, " }")).apply(void 0, [n].concat(_toConsumableArray(Object.values(i))));

              return "function" == typeof _e10 ? Promise.resolve(_e10.call(n, i.$event)) : Promise.resolve();
            }

            return Promise.resolve(new e(["dataContext"].concat(_toConsumableArray(Object.keys(i))), "with(dataContext) { ".concat(t, " }")).apply(void 0, [n].concat(_toConsumableArray(Object.values(i)))));
          }, {
            el: e,
            expression: t
          });
        }(e, t, this.$data, n(n({}, i()), {}, {
          $dispatch: this.getDispatchFunction(e)
        }));
      }
    }, {
      key: "getDispatchFunction",
      value: function getDispatchFunction(e) {
        return function (t) {
          var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
          e.dispatchEvent(new CustomEvent(t, {
            detail: n,
            bubbles: !0
          }));
        };
      }
    }, {
      key: "listenForNewElementsToInitialize",
      value: function listenForNewElementsToInitialize() {
        var _this8 = this;

        var e = this.$el;
        new MutationObserver(function (e) {
          for (var _t3 = 0; _t3 < e.length; _t3++) {
            var _n5 = e[_t3].target.closest("[x-data]");

            if (_n5 && _n5.isSameNode(_this8.$el)) {
              if ("attributes" === e[_t3].type && "x-data" === e[_t3].attributeName) {
                (function () {
                  var n = e[_t3].target.getAttribute("x-data") || "{}",
                      i = f(_this8.$el, n, {
                    $el: _this8.$el
                  });
                  Object.keys(i).forEach(function (e) {
                    _this8.$data[e] !== i[e] && (_this8.$data[e] = i[e]);
                  });
                })();
              }

              e[_t3].addedNodes.length > 0 && e[_t3].addedNodes.forEach(function (e) {
                1 !== e.nodeType || e.__x_inserted_me || (!e.matches("[x-data]") || e.__x ? _this8.initializeElements(e) : e.__x = new be(e));
              });
            }
          }
        }).observe(e, {
          childList: !0,
          attributes: !0,
          subtree: !0
        });
      }
    }, {
      key: "getRefsProxy",
      value: function getRefsProxy() {
        var e = this;
        return new Proxy({}, {
          get: function get(t, n) {
            return "$isAlpineProxy" === n || (e.walkAndSkipNestedComponents(e.$el, function (e) {
              e.hasAttribute("x-ref") && e.getAttribute("x-ref") === n && (i = e);
            }), i);
            var i;
          }
        });
      }
    }]);

    return be;
  }();

  var xe = {
    version: "2.8.0",
    pauseMutationObserver: !1,
    magicProperties: {},
    onComponentInitializeds: [],
    onBeforeComponentInitializeds: [],
    ignoreFocusedForValueBinding: !1,
    start: function () {
      var _start = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee2() {
        var _this9 = this;

        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.t0 = r();

                if (_context2.t0) {
                  _context2.next = 4;
                  break;
                }

                _context2.next = 4;
                return new Promise(function (e) {
                  "loading" == document.readyState ? document.addEventListener("DOMContentLoaded", e) : e();
                });

              case 4:
                this.discoverComponents(function (e) {
                  _this9.initializeComponent(e);
                });
                document.addEventListener("turbolinks:load", function () {
                  _this9.discoverUninitializedComponents(function (e) {
                    _this9.initializeComponent(e);
                  });
                });
                this.listenForNewUninitializedComponentsAtRunTime();

              case 7:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function start() {
        return _start.apply(this, arguments);
      }

      return start;
    }(),
    discoverComponents: function discoverComponents(e) {
      document.querySelectorAll("[x-data]").forEach(function (t) {
        e(t);
      });
    },
    discoverUninitializedComponents: function discoverUninitializedComponents(e) {
      var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var n = (t || document).querySelectorAll("[x-data]");
      Array.from(n).filter(function (e) {
        return void 0 === e.__x;
      }).forEach(function (t) {
        e(t);
      });
    },
    listenForNewUninitializedComponentsAtRunTime: function listenForNewUninitializedComponentsAtRunTime() {
      var _this10 = this;

      var e = document.querySelector("body");
      new MutationObserver(function (e) {
        if (!_this10.pauseMutationObserver) for (var _t4 = 0; _t4 < e.length; _t4++) {
          e[_t4].addedNodes.length > 0 && e[_t4].addedNodes.forEach(function (e) {
            1 === e.nodeType && (e.parentElement && e.parentElement.closest("[x-data]") || _this10.discoverUninitializedComponents(function (e) {
              _this10.initializeComponent(e);
            }, e.parentElement));
          });
        }
      }).observe(e, {
        childList: !0,
        attributes: !0,
        subtree: !0
      });
    },
    initializeComponent: function initializeComponent(e) {
      if (!e.__x) try {
        e.__x = new be(e);
      } catch (e) {
        setTimeout(function () {
          throw e;
        }, 0);
      }
    },
    clone: function clone(e, t) {
      t.__x || (t.__x = new be(t, e));
    },
    addMagicProperty: function addMagicProperty(e, t) {
      this.magicProperties[e] = t;
    },
    onComponentInitialized: function onComponentInitialized(e) {
      this.onComponentInitializeds.push(e);
    },
    onBeforeComponentInitialized: function onBeforeComponentInitialized(e) {
      this.onBeforeComponentInitializeds.push(e);
    }
  };
  return r() || (window.Alpine = xe, window.deferLoadingAlpine ? window.deferLoadingAlpine(function () {
    window.Alpine.start();
  }) : window.Alpine.start()), xe;
});

/***/ }),

/***/ "./src/app.js":
/*!********************!*\
  !*** ./src/app.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var js_cookie__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! js-cookie */ "./node_modules/js-cookie/src/js.cookie.js");
/* harmony import */ var js_cookie__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(js_cookie__WEBPACK_IMPORTED_MODULE_2__);


function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }


 // 注册链接
// prism-ajax-pagename

var prismKit = /*#__PURE__*/function () {
  function prismKit() {
    _classCallCheck(this, prismKit);

    this.api_base_url = '{app_url}/api/';
    this.stripe_key = '{stripe_key}'; // this.lock_path = [
    //     {"path":"/vip","match":1,"redir":"/forbidden.html"}
    // ];

    this.lock_path = false;
  }

  _createClass(prismKit, [{
    key: "post",
    value: function () {
      var _post = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee(path, data) {
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.request('post', this.api_base_url + path, data);

              case 2:
                return _context.abrupt("return", _context.sent);

              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function post(_x, _x2) {
        return _post.apply(this, arguments);
      }

      return post;
    }()
  }, {
    key: "get",
    value: function () {
      var _get = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee2(path) {
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.request('get', this.api_base_url + path);

              case 2:
                return _context2.abrupt("return", _context2.sent);

              case 3:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function get(_x3) {
        return _get.apply(this, arguments);
      }

      return get;
    }()
  }, {
    key: "request",
    value: function () {
      var _request = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee3(method, url, data) {
        var params, headers, jwt, message, errors;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                params = new URLSearchParams();

                if (data) {
                  Object.keys(data).forEach(function (item) {
                    return params.append(item, data[item]);
                  });
                }

                headers = {
                  Accept: 'application/json'
                };
                jwt = this.load_jwt();

                if (jwt) {
                  params.append('jwt', jwt);
                  headers['Authorization'] = 'Bearer ' + jwt;
                }

                _context3.prev = 5;

                if (!(method == 'get')) {
                  _context3.next = 14;
                  break;
                }

                _context3.t0 = this;
                _context3.next = 10;
                return axios__WEBPACK_IMPORTED_MODULE_1___default().get(url, {
                  headers: headers
                });

              case 10:
                _context3.t1 = _context3.sent;
                return _context3.abrupt("return", _context3.t0.return_data.call(_context3.t0, _context3.t1));

              case 14:
                _context3.t2 = this;
                _context3.next = 17;
                return axios__WEBPACK_IMPORTED_MODULE_1___default().post(url, params, {
                  headers: headers
                });

              case 17:
                _context3.t3 = _context3.sent;
                return _context3.abrupt("return", _context3.t2.return_data.call(_context3.t2, _context3.t3));

              case 19:
                _context3.next = 42;
                break;

              case 21:
                _context3.prev = 21;
                _context3.t4 = _context3["catch"](5);
                message = _context3.t4.response && _context3.t4.response.data || _context3.t4.message;
                console.log("message", message);

                if (!(message.message == 'Signature verification failed')) {
                  _context3.next = 28;
                  break;
                }

                this.user_logout();
                return _context3.abrupt("return", true);

              case 28:
                if (!(message.message == 'Login first')) {
                  _context3.next = 31;
                  break;
                }

                this.load_page('login');
                return _context3.abrupt("return", true);

              case 31:
                if (!(message.errors.error == 'Already has a subscription')) {
                  _context3.next = 34;
                  break;
                }

                if (window.confirm(message.errors.error + ', manage it?')) this.stripe_port();
                return _context3.abrupt("return", true);

              case 34:
                if (!message.errors) {
                  _context3.next = 38;
                  break;
                }

                errors = Object.values(message.errors);
                alert(errors.join(" "));
                return _context3.abrupt("return", false);

              case 38:
                if (!message.message) {
                  _context3.next = 41;
                  break;
                }

                alert(message.message);
                return _context3.abrupt("return", false);

              case 41:
                return _context3.abrupt("return", false);

              case 42:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[5, 21]]);
      }));

      function request(_x4, _x5, _x6) {
        return _request.apply(this, arguments);
      }

      return request;
    }()
  }, {
    key: "return_data",
    value: function return_data(ret) {
      return ret;

      if (ret.status != 200) {
        return ret;
      }

      var data = ret.data;
      return data;
    }
  }, {
    key: "load_page",
    value: function () {
      var _load_page = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee4(page) {
        var _yield$this$get, data;

        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return this.get('page/' + page);

              case 2:
                _yield$this$get = _context4.sent;
                data = _yield$this$get.data;

                if (data) {
                  _context4.next = 6;
                  break;
                }

                return _context4.abrupt("return", false);

              case 6:
                this.make_layout();
                this.show_layout();
                document.querySelector("#prism-layout-div").innerHTML = data;

              case 9:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function load_page(_x7) {
        return _load_page.apply(this, arguments);
      }

      return load_page;
    }()
  }, {
    key: "show_layout",
    value: function show_layout() {
      document.querySelector("#prism-layout-div").style.display = 'block';
    }
  }, {
    key: "hide_layout",
    value: function hide_layout() {
      document.querySelector("#prism-layout-div").style.display = 'none';
      document.querySelector("#prism-layout-div").innerHTML = '';
    }
  }, {
    key: "make_layout",
    value: function make_layout() {
      var layout_id = 'prism-layout-div';

      if (!document.querySelector("#" + layout_id)) {
        var thediv = document.createElement("div");
        thediv.id = layout_id;
        thediv.className = 'prism-layout';
        document.body.appendChild(thediv);
      }
    }
  }, {
    key: "check_lock",
    value: function () {
      var _check_lock = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee5() {
        var force_request,
            _yield$this$get2,
            data,
            _iterator,
            _step,
            lock,
            do_lock,
            member_show_items,
            _iterator2,
            _step2,
            node,
            member_hide_items,
            _iterator3,
            _step3,
            _node,
            _args5 = arguments;

        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                force_request = _args5.length > 0 && _args5[0] !== undefined ? _args5[0] : false;

                if (!(!this.lock_path || force_request)) {
                  _context5.next = 10;
                  break;
                }

                _context5.next = 4;
                return this.get('lock');

              case 4:
                _yield$this$get2 = _context5.sent;
                data = _yield$this$get2.data;

                if (data) {
                  _context5.next = 8;
                  break;
                }

                return _context5.abrupt("return", this.user_logout());

              case 8:
                this.lock_path = data.locks || [];
                this.is_member = data.is_member > 0;

              case 10:
                _iterator = _createForOfIteratorHelper(this.lock_path);

                try {
                  for (_iterator.s(); !(_step = _iterator.n()).done;) {
                    lock = _step.value;
                    do_lock = false;

                    if (lock.match == 1) {
                      if (window.location.pathname.indexOf(lock.path) >= 0) {
                        do_lock = true;
                      }
                    }

                    if (lock.match == 2) {
                      if (window.location.pathname == lock.path) {
                        do_lock = true;
                      }
                    }

                    if (do_lock) {
                      window.document.body.style.display = 'none';
                      window.document.body.innerHTML = '';
                      window.location = lock.redir;
                    }
                  } // 对会员显示

                } catch (err) {
                  _iterator.e(err);
                } finally {
                  _iterator.f();
                }

                member_show_items = document.querySelectorAll(".prism-member-show");

                if (member_show_items) {
                  _iterator2 = _createForOfIteratorHelper(member_show_items);

                  try {
                    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                      node = _step2.value;
                      if (!this.is_member) node.style.display = 'none';else node.style.display = 'inherit';
                    }
                  } catch (err) {
                    _iterator2.e(err);
                  } finally {
                    _iterator2.f();
                  }
                }

                member_hide_items = document.querySelectorAll(".prism-member-hide");

                if (member_hide_items) {
                  _iterator3 = _createForOfIteratorHelper(member_hide_items);

                  try {
                    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                      _node = _step3.value;
                      if (this.is_member) _node.style.display = 'none';else _node.style.display = 'inherit';
                    }
                  } catch (err) {
                    _iterator3.e(err);
                  } finally {
                    _iterator3.f();
                  }
                }

              case 16:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function check_lock() {
        return _check_lock.apply(this, arguments);
      }

      return check_lock;
    }()
  }, {
    key: "user_login",
    value: function () {
      var _user_login = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee6() {
        var _document$querySelect, _document$querySelect2;

        var email_value,
            password_value,
            email,
            password,
            params,
            _yield$this$post,
            data,
            _args6 = arguments;

        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                email_value = _args6.length > 0 && _args6[0] !== undefined ? _args6[0] : false;
                password_value = _args6.length > 1 && _args6[1] !== undefined ? _args6[1] : false;
                email = email_value || ((_document$querySelect = document.querySelector(".prism-form [name='prism-login-email']")) === null || _document$querySelect === void 0 ? void 0 : _document$querySelect.value);
                password = password_value || ((_document$querySelect2 = document.querySelector(".prism-form [name='prism-login-password']")) === null || _document$querySelect2 === void 0 ? void 0 : _document$querySelect2.value); // 向服务器端请求数据

                params = {
                  email: email,
                  password: password
                };
                _context6.next = 7;
                return this.post('login', params);

              case 7:
                _yield$this$post = _context6.sent;
                data = _yield$this$post.data;

                if (!(data && data.jwt)) {
                  _context6.next = 17;
                  break;
                }

                this.save_jwt(data.jwt);
                this.check_lock(true);

                if (!email_value) {
                  _context6.next = 16;
                  break;
                }

                return _context6.abrupt("return", data);

              case 16:
                this.hide_layout();

              case 17:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function user_login() {
        return _user_login.apply(this, arguments);
      }

      return user_login;
    }()
  }, {
    key: "user_forget",
    value: function () {
      var _user_forget = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee7() {
        var _document$querySelect3;

        var email_value,
            email,
            params,
            _yield$this$post2,
            data,
            _args7 = arguments;

        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                email_value = _args7.length > 0 && _args7[0] !== undefined ? _args7[0] : false;
                email = email_value || ((_document$querySelect3 = document.querySelector(".prism-form [name='prism-forget-email']")) === null || _document$querySelect3 === void 0 ? void 0 : _document$querySelect3.value); // 向服务器端请求数据

                params = {
                  email: email
                };
                _context7.next = 5;
                return this.post('forgot-password', params);

              case 5:
                _yield$this$post2 = _context7.sent;
                data = _yield$this$post2.data;
                console.log("forget", data);

                if (!(data && data.message)) {
                  _context7.next = 15;
                  break;
                }

                if (!email_value) {
                  _context7.next = 13;
                  break;
                }

                return _context7.abrupt("return", data);

              case 13:
                alert(data.message);
                this.load_page('login');

              case 15:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function user_forget() {
        return _user_forget.apply(this, arguments);
      }

      return user_forget;
    }()
  }, {
    key: "save_jwt",
    value: function save_jwt(jwt) {
      js_cookie__WEBPACK_IMPORTED_MODULE_2___default().set("PRISMKIT-JWT", jwt);
    }
  }, {
    key: "load_jwt",
    value: function load_jwt() {
      return js_cookie__WEBPACK_IMPORTED_MODULE_2___default().get("PRISMKIT-JWT");
    }
  }, {
    key: "stripe_port",
    value: function () {
      var _stripe_port = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee8() {
        var forward,
            _yield$this$post3,
            data,
            status,
            _args8 = arguments;

        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                forward = _args8.length > 0 && _args8[0] !== undefined ? _args8[0] : true;
                _context8.next = 3;
                return this.post('stripe_port', {});

              case 3:
                _yield$this$post3 = _context8.sent;
                data = _yield$this$post3.data;
                status = _yield$this$post3.status;

                if (!(data && data.url)) {
                  _context8.next = 12;
                  break;
                }

                if (!forward) {
                  _context8.next = 11;
                  break;
                }

                window.location = data.url;
                _context8.next = 12;
                break;

              case 11:
                return _context8.abrupt("return", data);

              case 12:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function stripe_port() {
        return _stripe_port.apply(this, arguments);
      }

      return stripe_port;
    }()
  }, {
    key: "user_logout",
    value: function () {
      var _user_logout = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee9() {
        var reload,
            ret,
            _document$querySelect4,
            _args9 = arguments;

        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                reload = _args9.length > 0 && _args9[0] !== undefined ? _args9[0] : true;
                ret = js_cookie__WEBPACK_IMPORTED_MODULE_2___default().remove("PRISMKIT-JWT");

                if (!reload) {
                  _context9.next = 8;
                  break;
                }

                // close
                if (((_document$querySelect4 = document.querySelector("#prism-layout-div")) === null || _document$querySelect4 === void 0 ? void 0 : _document$querySelect4.length) > 0) {
                  document.querySelector("#prism-layout-div").innerHTML = '';
                  document.querySelector("#prism-layout-div").style.display = 'none';
                }

                window.history.pushState(null, null, '#');
                window.location.reload();
                _context9.next = 9;
                break;

              case 8:
                return _context9.abrupt("return", ret);

              case 9:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9);
      }));

      function user_logout() {
        return _user_logout.apply(this, arguments);
      }

      return user_logout;
    }()
  }, {
    key: "user_register",
    value: function () {
      var _user_register = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee10() {
        var _document$querySelect5, _document$querySelect6, _document$querySelect7, _document$querySelect8;

        var name_value,
            email_value,
            password_value,
            password_confirmation_value,
            name,
            email,
            password,
            password_confirmation,
            params,
            _yield$this$post4,
            data,
            status,
            _args10 = arguments;

        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                name_value = _args10.length > 0 && _args10[0] !== undefined ? _args10[0] : false;
                email_value = _args10.length > 1 && _args10[1] !== undefined ? _args10[1] : false;
                password_value = _args10.length > 2 && _args10[2] !== undefined ? _args10[2] : false;
                password_confirmation_value = _args10.length > 3 && _args10[3] !== undefined ? _args10[3] : false;
                name = name_value || ((_document$querySelect5 = document.querySelector(".prism-form [name='prism-reg-name']")) === null || _document$querySelect5 === void 0 ? void 0 : _document$querySelect5.value);
                email = email_value || ((_document$querySelect6 = document.querySelector(".prism-form [name='prism-reg-email']")) === null || _document$querySelect6 === void 0 ? void 0 : _document$querySelect6.value);
                password = password_value || ((_document$querySelect7 = document.querySelector(".prism-form [name='prism-reg-password']")) === null || _document$querySelect7 === void 0 ? void 0 : _document$querySelect7.value);
                password_confirmation = password_confirmation_value || ((_document$querySelect8 = document.querySelector(".prism-form [name='prism-reg-password-confirm']")) === null || _document$querySelect8 === void 0 ? void 0 : _document$querySelect8.value);

                if (!(password != password_confirmation)) {
                  _context10.next = 11;
                  break;
                }

                alert("Password not the same");
                return _context10.abrupt("return", false);

              case 11:
                params = {
                  name: name,
                  email: email,
                  password: password,
                  password_confirmation: password_confirmation
                };
                _context10.next = 14;
                return this.post('register', params);

              case 14:
                _yield$this$post4 = _context10.sent;
                data = _yield$this$post4.data;
                status = _yield$this$post4.status;

                if (!(status == 201)) {
                  _context10.next = 23;
                  break;
                }

                if (!email_value) {
                  _context10.next = 22;
                  break;
                }

                return _context10.abrupt("return", status);

              case 22:
                // 创建成功
                this.load_page('login');

              case 23:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function user_register() {
        return _user_register.apply(this, arguments);
      }

      return user_register;
    }()
  }, {
    key: "do_sub",
    value: function () {
      var _do_sub = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee11(subid) {
        var forward,
            _yield$this$post5,
            data,
            status,
            stripe,
            _args11 = arguments;

        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                forward = _args11.length > 1 && _args11[1] !== undefined ? _args11[1] : true;
                _context11.next = 3;
                return this.post('subscribe', {
                  "id": subid
                });

              case 3:
                _yield$this$post5 = _context11.sent;
                data = _yield$this$post5.data;
                status = _yield$this$post5.status;

                if (!(data && data.id)) {
                  _context11.next = 13;
                  break;
                }

                if (!forward) {
                  _context11.next = 12;
                  break;
                }

                // stripe_key
                stripe = Stripe(this.stripe_key);
                stripe.redirectToCheckout({
                  sessionId: data === null || data === void 0 ? void 0 : data.id
                });
                _context11.next = 13;
                break;

              case 12:
                return _context11.abrupt("return", data);

              case 13:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));

      function do_sub(_x8) {
        return _do_sub.apply(this, arguments);
      }

      return do_sub;
    }()
  }]);

  return prismKit;
}();

var prism_kit = new prismKit();
window.prism_kit = prism_kit;
document.addEventListener("DOMContentLoaded", /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee13(event) {
    var pages, _iterator4, _step4, _loop, subs, _iterator5, _step5, _loop2;

    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            _context13.next = 2;
            return prism_kit.check_lock();

          case 2:
            window.setInterval( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee12() {
              return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee12$(_context12) {
                while (1) {
                  switch (_context12.prev = _context12.next) {
                    case 0:
                      _context12.next = 2;
                      return prism_kit.check_lock();

                    case 2:
                    case "end":
                      return _context12.stop();
                  }
                }
              }, _callee12);
            })), 1000 * 10); // ajax 加载页面

            pages = document.querySelectorAll("[href^='#prism-ajax-']");

            if (pages) {
              _iterator4 = _createForOfIteratorHelper(pages);

              try {
                _loop = function _loop() {
                  var node = _step4.value;

                  node.onclick = function (e) {
                    e.preventDefault();
                    var push = new URL(node.href).hash.substr(1);
                    prism_kit.load_page(new URL(node.href).hash.substr('#prism-ajax-'.length));
                    window.history.pushState(null, null, '#' + push);
                  };
                };

                for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                  _loop();
                }
              } catch (err) {
                _iterator4.e(err);
              } finally {
                _iterator4.f();
              }
            } // sub 转向订阅支付页面


            subs = document.querySelectorAll("[href^='#prism-sub-']");

            if (subs) {
              _iterator5 = _createForOfIteratorHelper(subs);

              try {
                _loop2 = function _loop2() {
                  var node = _step5.value;

                  node.onclick = function (e) {
                    e.preventDefault();
                    var push = new URL(node.href).hash.substr(1);
                    prism_kit.do_sub(new URL(node.href).hash.substr('#prism-sub-'.length));
                    window.history.pushState(null, null, '#' + push);
                  };
                };

                for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
                  _loop2();
                }
              } catch (err) {
                _iterator5.e(err);
              } finally {
                _iterator5.f();
              }
            }

            document.querySelector("body").style.visibility = "visible";

          case 8:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13);
  }));

  return function (_x9) {
    return _ref.apply(this, arguments);
  };
}());

/***/ }),

/***/ "./node_modules/js-cookie/src/js.cookie.js":
/*!*************************************************!*\
  !*** ./node_modules/js-cookie/src/js.cookie.js ***!
  \*************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * JavaScript Cookie v2.2.1
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */
;(function (factory) {
	var registeredInModuleLoader;
	if (true) {
		!(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
		__WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		registeredInModuleLoader = true;
	}
	if (true) {
		module.exports = factory();
		registeredInModuleLoader = true;
	}
	if (!registeredInModuleLoader) {
		var OldCookies = window.Cookies;
		var api = window.Cookies = factory();
		api.noConflict = function () {
			window.Cookies = OldCookies;
			return api;
		};
	}
}(function () {
	function extend () {
		var i = 0;
		var result = {};
		for (; i < arguments.length; i++) {
			var attributes = arguments[ i ];
			for (var key in attributes) {
				result[key] = attributes[key];
			}
		}
		return result;
	}

	function decode (s) {
		return s.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent);
	}

	function init (converter) {
		function api() {}

		function set (key, value, attributes) {
			if (typeof document === 'undefined') {
				return;
			}

			attributes = extend({
				path: '/'
			}, api.defaults, attributes);

			if (typeof attributes.expires === 'number') {
				attributes.expires = new Date(new Date() * 1 + attributes.expires * 864e+5);
			}

			// We're using "expires" because "max-age" is not supported by IE
			attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';

			try {
				var result = JSON.stringify(value);
				if (/^[\{\[]/.test(result)) {
					value = result;
				}
			} catch (e) {}

			value = converter.write ?
				converter.write(value, key) :
				encodeURIComponent(String(value))
					.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);

			key = encodeURIComponent(String(key))
				.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent)
				.replace(/[\(\)]/g, escape);

			var stringifiedAttributes = '';
			for (var attributeName in attributes) {
				if (!attributes[attributeName]) {
					continue;
				}
				stringifiedAttributes += '; ' + attributeName;
				if (attributes[attributeName] === true) {
					continue;
				}

				// Considers RFC 6265 section 5.2:
				// ...
				// 3.  If the remaining unparsed-attributes contains a %x3B (";")
				//     character:
				// Consume the characters of the unparsed-attributes up to,
				// not including, the first %x3B (";") character.
				// ...
				stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
			}

			return (document.cookie = key + '=' + value + stringifiedAttributes);
		}

		function get (key, json) {
			if (typeof document === 'undefined') {
				return;
			}

			var jar = {};
			// To prevent the for loop in the first place assign an empty array
			// in case there are no cookies at all.
			var cookies = document.cookie ? document.cookie.split('; ') : [];
			var i = 0;

			for (; i < cookies.length; i++) {
				var parts = cookies[i].split('=');
				var cookie = parts.slice(1).join('=');

				if (!json && cookie.charAt(0) === '"') {
					cookie = cookie.slice(1, -1);
				}

				try {
					var name = decode(parts[0]);
					cookie = (converter.read || converter)(cookie, name) ||
						decode(cookie);

					if (json) {
						try {
							cookie = JSON.parse(cookie);
						} catch (e) {}
					}

					jar[name] = cookie;

					if (key === name) {
						break;
					}
				} catch (e) {}
			}

			return key ? jar[key] : jar;
		}

		api.set = set;
		api.get = function (key) {
			return get(key, false /* read as raw */);
		};
		api.getJSON = function (key) {
			return get(key, true /* read as json */);
		};
		api.remove = function (key, attributes) {
			set(key, '', extend(attributes, {
				expires: -1
			}));
		};

		api.defaults = {};

		api.withConverter = init;

		return api;
	}

	return init(function () {});
}));


/***/ }),

/***/ "./src/app.scss":
/*!**********************!*\
  !*** ./src/app.scss ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/process/browser.js":
/*!*****************************************!*\
  !*** ./node_modules/process/browser.js ***!
  \*****************************************/
/***/ ((module) => {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ "./node_modules/regenerator-runtime/runtime.js":
/*!*****************************************************!*\
  !*** ./node_modules/regenerator-runtime/runtime.js ***!
  \*****************************************************/
/***/ ((module) => {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
   true ? module.exports : 0
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/******/ 	// the startup function
/******/ 	// It's empty as some runtime module handles the default behavior
/******/ 	__webpack_require__.x = x => {};
/************************************************************************/
/******/ 	/* webpack/runtime/amd options */
/******/ 	(() => {
/******/ 		__webpack_require__.amdO = {};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/harmony module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.hmd = (module) => {
/******/ 			module = Object.create(module);
/******/ 			if (!module.children) module.children = [];
/******/ 			Object.defineProperty(module, 'exports', {
/******/ 				enumerable: true,
/******/ 				set: () => {
/******/ 					throw new Error('ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: ' + module.id);
/******/ 				}
/******/ 			});
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// Promise = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"/dist/app": 0
/******/ 		};
/******/ 		
/******/ 		var deferredModules = [
/******/ 			["./src/alpine.min.js"],
/******/ 			["./src/app.js"],
/******/ 			["./src/app.scss"]
/******/ 		];
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		var checkDeferredModules = x => {};
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime, executeModules] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0, resolves = [];
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					resolves.push(installedChunks[chunkId][0]);
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			for(moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 				}
/******/ 			}
/******/ 			if(runtime) runtime(__webpack_require__);
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			while(resolves.length) {
/******/ 				resolves.shift()();
/******/ 			}
/******/ 		
/******/ 			// add entry modules from loaded chunk to deferred list
/******/ 			if(executeModules) deferredModules.push.apply(deferredModules, executeModules);
/******/ 		
/******/ 			// run deferred modules when all chunks ready
/******/ 			return checkDeferredModules();
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunksite"] = self["webpackChunksite"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 		
/******/ 		function checkDeferredModulesImpl() {
/******/ 			var result;
/******/ 			for(var i = 0; i < deferredModules.length; i++) {
/******/ 				var deferredModule = deferredModules[i];
/******/ 				var fulfilled = true;
/******/ 				for(var j = 1; j < deferredModule.length; j++) {
/******/ 					var depId = deferredModule[j];
/******/ 					if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferredModules.splice(i--, 1);
/******/ 					result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 				}
/******/ 			}
/******/ 			if(deferredModules.length === 0) {
/******/ 				__webpack_require__.x();
/******/ 				__webpack_require__.x = x => {};
/******/ 			}
/******/ 			return result;
/******/ 		}
/******/ 		var startup = __webpack_require__.x;
/******/ 		__webpack_require__.x = () => {
/******/ 			// reset startup function so it can be called again when more startup code is added
/******/ 			__webpack_require__.x = startup || (x => {});
/******/ 			return (checkDeferredModules = checkDeferredModulesImpl)();
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// run startup
/******/ 	var __webpack_exports__ = __webpack_require__.x();
/******/ 	
/******/ })()
;
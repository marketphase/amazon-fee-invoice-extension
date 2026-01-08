/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ../node_modules/chromane/js/Log.js
class Log {
  constructor(config) {
    this.config = config;
  }
  write() {
    if (this.config !== "prod") {
      console.log(Array.from(arguments));
    }
  }
  write_method_call({
    obj,
    class_name,
    method_name,
    args,
    output,
    error,
    stub,
    stack,
    ignore,
  }) {
    if (!ignore && this.config !== "prod") {
      let log_color = "eggshell";
      if (stub) {
        log_color = "yellow";
      } else if (error) {
        log_color = "red";
      } else {
        log_color = "white";
      }

      console.groupCollapsed(
        "%c " + class_name + "." + method_name,
        `color: ${log_color}`
      );
      console.log("this:");
      console.log(obj);
      console.log("input:");
      for (var i = 0; i < args.length; i++) {
        console.log(args[i]);
      }
      console.log(args);
      console.log("output:");
      console.log(output);

      if (error) {
        console.log(stack);
      }

      console.groupEnd();
    }
  }
  do_not_log() {}
  do_log() {}
}

;// CONCATENATED MODULE: ../node_modules/chromane/js/Util.js


class Util {
  // mutation change observer
  detect_changes_simple(target, interval, callback) {
    let change_handled_flag = true;
    let observer = new MutationObserver(() => {
      change_handled_flag = false;
    });
    observer.observe(target, {
      attributes: true,
      childList: true,
      subtree: true,
    });
    setInterval(() => {
      if (change_handled_flag === false) {
        callback();
        change_handled_flag = true;
      }
    }, interval);
    callback();
  }
  // !NOT FINISHED
  detect_changes(target, interval, callback) {
    let last_change_ts = 0;
    let last_callback_call_ts = 0;
    let observer = new MutationObserver(() => {
      let now_ts = Date.now();
      if (now_ts - last_change_ts > intervalc) {
      }
      last_change_ts = Date.now();
    });
    observer.observe(target, {
      attributes: true,
      childList: true,
      subtree: true,
    });
    setInterval(() => {}, interval);
    callback();
  }
  //
  inject_js() {
    let script = document.createElement("script");
    script.src = chrome.runtime.getURL("/js/injected.js");
    document.documentElement.append(script);
  }
  async inject_css() {
    var css = await this.fetch_text(this.get_url("/css/content.css"));
    document.documentElement.append(
      this.html_to_element(`<style>${css}</style>`)
    );
  }
  get_iframe_src() {
    if (this.config.mode === "dev") {
      return "http://localhost:2010/";
    } else {
      return chrome.runtime.getURL("/pages/app/index.html");
    }
  }
  find_text_input(element) {
    let text_input = Array.from(
      element.querySelectorAll("input, textarea")
    ).filter((input) => {
      return (
        input.type === "text" ||
        input.type === "textarea" ||
        input.type === "number" ||
        input.type === "email"
      );
    })[0];
    return text_input;
  }
  constructor(config) {
    this.config = config;
    this.log = new Log(config);
  }
  get_url(url) {
    return chrome.runtime.getURL(url);
  }
  get_value(selector) {
    let el = $(selector).get(0);

    if (el) {
      if (el.tagName === "META") {
        return el.getAttribute("content").trim();
      } else {
        return el.textContent.trim();
      }
    } else {
      return "Not available";
    }
  }
  async wait(time) {
    return new Promise((resolve) => {
      setTimeout(resolve, time);
    });
  }
  decode_json(text) {
    try {
      return JSON.parse(text);
    } catch (e) {
      return null;
    }
  }
  async fetch_json(url, data) {
    let r = await fetch(url, data);
    let text = await r.text();
    try {
      return JSON.parse(text);
    } catch (e) {
      console.log("error");
      console.log(e);
      return null;
    }
  }
  async fetch_text(url) {
    let r = await fetch(url);
    let text = await r.text();
    return text;
  }
  async wait_for_ready_state_complete() {
    while (true) {
      if (document.readyState === "complete") {
        return;
      } else {
        await this.wait(200);
      }
    }
  }
  async wait_for_element(selector) {
    for (let i = 0; i < 1000; i++) {
      let element = document.querySelector(selector);
      if (element) {
        return element;
      } else {
        await this.wait(100);
      }
    }
  }
  simulate(element, event_name) {
    element.dispatchEvent(new Event(event_name, { bubbles: true }));
  }
  html_to_element(html) {
    // var doc = new DOMParser().parseFromString(html, "text/html");
    // this.deps.log.write("doc", doc);
    // return doc.body.firstChild;

    let div = document.createElement("div");
    div.innerHTML = html;
    return div.firstElementChild;
  }
  // complex selectors
  run_complex_selector(selector) {
    // init root_element
    if (selector.root_css) {
      var root_element = document.querySelector(selector.root_css);

      if (!root_element) {
        root_element = document;
      }
    } else if (selector.root_element) {
      var root_element = selector.root_element;
    } else {
      var root_element = document;
    }

    // this.deps.log.write("root_element", root_element);

    // init element_arr
    if (selector.css) {
      var element_arr = Array.from(root_element.querySelectorAll(selector.css));
    } else {
      var element_arr = Array.from(root_element.querySelectorAll("*"));
    }

    // this.deps.log.write("element_arr", element_arr);

    // filter by inner_text

    if (selector.inner_text) {
      for (var i = element_arr.length; i--; ) {
        if (element_arr[i].innerText !== selector.inner_text) {
          element_arr.splice(i, 1);
        }
      }
    }

    if (selector.inner_text_includes) {
      for (var i = element_arr.length; i--; ) {
        if (
          element_arr[i].innerText
            .toLowerCase()
            .includes(selector.inner_text_includes) === false
        ) {
          element_arr.splice(i, 1);
        }
      }
    }

    // filter by style
    if (selector.style) {
      var key_arr = Object.keys(selector.style);
      var style = null;

      loop_1: for (var i = element_arr.length; i--; ) {
        style = window.getComputedStyle(element_arr[i]);

        loop_2: for (var j = key_arr.length; j--; ) {
          if (selector.style[key_arr[j]] !== style[key_arr[j]]) {
            element_arr.splice(i, 1);
            continue loop_1;
          }
        }
      }
    }

    //filter by min_area
    if (selector.min_area) {
      for (let i = element_arr.length; i--; ) {
        let rect = element_arr[i].getBoundingClientRect();
        let area = rect.width * rect.height;
        if (area < selector.min_area) {
          element_arr.splice(i, 1);
        }
      }
    }

    // return
    return element_arr;
  }
  find_element(complex_selector_arr) {
    var element = null;

    for (var i = 0; i < complex_selector_arr.length; i++) {
      var element_arr = this.run_complex_selector(complex_selector_arr[i]);

      if (element_arr && element_arr.length > 0) {
        return element_arr[0];
      }
    }

    return null;
  }
  find_elements(complex_selector_arr) {
    var element = null;

    for (var i = 0; i < complex_selector_arr.length; i++) {
      var element_arr = this.run_complex_selector(complex_selector_arr[i]);

      if (element_arr && element_arr.length > 0) {
        return element_arr;
      } else {
        return [];
      }
    }

    return null;
  }
  bg_fetch(url, data) {
    return new Promise((r) => {
      chrome.runtime.sendMessage(
        {
          name: "fetch_json",
          data: { url, data },
        },
        (result) => {
          r(result);
        }
      );
    });
  }
  // window api
  create_iframe_wrap(iframe) {
    return new Promise((r) => {
      let listener = (event) => {
        if (
          event.data &&
          event.data.name === "iframe_ready" &&
          iframe.contentWindow === event.source
        ) {
          console.log("iframe_ready", event.source);
          let iframe_window = event.source;
          window.removeEventListener("message", listener);
          r(this.create_window_wrap(window, iframe_window));
        }
      };
      window.addEventListener("message", listener);
    });
  }
  create_window_wrap(window, target_window) {
    let _resolvers = [];
    window.addEventListener("message", async (event) => {
      if (event.data) {
        let name = event.data.name;
        let meta = event.data.meta;
        let data = event.data.data;
        if (
          name === "exec_result" &&
          meta &&
          meta.response &&
          _resolvers[meta.request_id]
        ) {
          _resolvers[meta.request_id](data.result);
        }
      }
    });
    return {
      exec: (name, data) => {
        return new Promise((r) => {
          let request_id = _resolvers.length;
          _resolvers.push(r);
          let meta = { request_id, request: true };
          target_window.postMessage({ name, meta, data }, "*");
        });
      },
    };
  }
  create_window_api(methods) {
    window.addEventListener("message", async (event) => {
      if (event.data) {
        let name = event.data.name;
        let meta = event.data.meta;
        let data = event.data.data;
        if (methods[name]) {
          let result = await methods[name](data);
          event.source.postMessage(
            {
              name: "exec_result",
              meta: {
                response: true,
                request_id: meta,
                request_id: meta.request_id,
              },
              data: { result },
            },
            "*"
          );
        }
      }
    });
  }
  // runtime api ( background )
  create_runtime_api(methods) {
    chrome.runtime.onMessage.addListener(function (message, sender, callback) {
      console.log(methods, message);
      if (methods[message.name]) {
        if (message.data && message.data._sender) {
          message.data._sender = sender;
        }
        methods[message.name](message.data).then(callback);
      } else {
        callback(null);
      }
      return true;
    });
  }
  runtime_exec(name, data) {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(
        {
          name,
          data,
        },
        resolve
      );
    });
  }
  // google sheets helper
  parse_rows(rows) {
    var data_arr = [];
    var data = null;

    // assume that the first row defines the property names of each object
    var property_name_arr = rows[0];

    for (var i = 1; i < rows.length; i++) {
      data = {};

      for (var j = 0; j < property_name_arr.length; j++) {
        data[property_name_arr[j]] = rows[i][j];
      }

      data_arr.push(data);
    }

    return data_arr;
  }
  // class wrapper
  get_methods(obj) {
    return Object.getOwnPropertyNames(obj).filter((item) => {
      return typeof obj[item] === "function";
    });
  }
  wrap_class(item, ignore) {
    ignore = ignore || [];
    let util = this;
    let class_name = item.name;
    let methods = this.get_methods(item.prototype);
    methods.forEach((method_name) => {
      let original = item.prototype[method_name];
      item.prototype[method_name] = function () {
        let log = {
          ignore: ignore.includes(method_name),
          obj: this,
          class_name,
          method_name,
          args: Array.from(arguments),
        };
        let stubs = util.stubs;
        if (
          stubs &&
          stubs[0] &&
          stubs[0].class_name === class_name &&
          stubs[0].method_name === method_name
        ) {
          log.stub = true;
          log.output = stubs[0].output;
          stubs.splice(0, 1);
          util.log.write_method_call(log);
          return log.output;
        } else {
          try {
            log.output = original.apply(this, arguments);
          } catch (e) {
            log.error = true;
            log.stack = e.stack;
            log.output = null;
          }
          if (log.output && log.output.then) {
            log.output = new Promise((resolve) => {
              log.output
                .then((result) => {
                  log.output = result;
                  util.log.write_method_call(log);
                  resolve(result);
                })
                .catch((e) => {
                  log.error = true;
                  log.stack = e.stack;
                  log.output = null;
                  util.log.write_method_call(log);
                  resolve(null);
                });
            });
          } else {
            util.log.write_method_call(log);
          }
          return log.output;
        }
      };
    });
  }
  set_stubs(stubs) {
    this.stubs = stubs;
  }
  // Old Common
  post_window_message(target, name, data) {
    target.postMessage({ name, data }, "*");
  }

  blob_to_base64(blob) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
  }

  download_string(str, name) {
    var blob = new Blob([str], { type: "text/plain" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");

    document.body.appendChild(a);
    a.style = "display: none";
    a.href = url;
    a.download = name;
    a.click();

    window.URL.revokeObjectURL(url);
  }

  download_blob(blob, name) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");

    document.body.appendChild(a);
    a.style = "display: none";
    a.href = url;
    a.download = name;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  find(arr, key, value) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i][key] === value) {
        return arr[i];
      }
    }
    return null;
  }

  update_object(object, new_object) {
    Object.keys(new_object).forEach((key) => {
      if (object[key] !== null && typeof object[key] === "object") {
        this.update_object(object[key], new_object[key]);
      } else {
        object[key] = new_object[key];
      }
    });
  }

  rows_to_data_arr(rows) {
    var data_arr = [];
    var data = null;
    // assume that the first row defines the property names of each object
    var property_name_arr = rows[0];
    for (var i = 1; i < rows.length; i++) {
      data = {};
      for (var j = 0; j < property_name_arr.length; j++) {
        data[property_name_arr[j]] = rows[i][j];
      }
      data_arr.push(data);
    }
    return data_arr;
  }

  to_data_url(url) {
    return new Promise((resolve) => {
      var xhr = new XMLHttpRequest();
      xhr.onload = function () {
        var reader = new FileReader();
        reader.onloadend = function () {
          resolve(reader.result);
        };
        reader.readAsDataURL(xhr.response);
      };

      xhr.open("GET", url);
      xhr.responseType = "blob";
      xhr.send();
    });
  }
}

;// CONCATENATED MODULE: ./config.json
const config_namespaceObject = JSON.parse('{"extension_type":"chromane","mode":"prod","browser":"chrome"}');
;// CONCATENATED MODULE: ../node_modules/chromane/js/util_instance.js



/* harmony default export */ const util_instance = (new Util(config_namespaceObject));

;// CONCATENATED MODULE: ./js/parser/parser.js
class Parser {
  constructor() {
    this.dom_parser = new DOMParser();
  }
  parse_fba_core_data_table_html(html) {
    let result = {};
    let doc = this.dom_parser.parseFromString(html, "text/html");
    result.buttons = [];
    result.table_data = Array.from(doc.querySelectorAll("tr")).map((row) => {
      let row_data = {};
      let button = row.querySelector("#view_invoice_button-announce");
      if (button) {
        let button_data = {};
        Object.keys(button.dataset).forEach((key) => {
          button_data[key] = button.dataset[key];
        });
        button_data.value = button.getAttribute("value");
        result.buttons.push(button_data);
        row_data.button_data = button_data;
      }
      row_data.fields = Array.from(row.querySelectorAll(".info")).map((cell) => {
        return cell.innerText.trim();
      });
      return row_data;
    });
    return result;
  }
}

let parser = new Parser();
/* harmony default export */ const parser_parser = (parser);

;// CONCATENATED MODULE: ./js/entry/views.js



async function views1() {
  let iframe = document.createElement("iframe");
  iframe.name = JSON.stringify({ context: "testing" });
  let iframe_wrap = util_instance.create_iframe_wrap(iframe);
  iframe.src = "http://localhost:2010";
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  document.body.append(iframe);
  // load data
  let html = await util_instance.fetch_text("./data/fba_core_data_table.html");
  let data = parser_parser.parse_fba_core_data_table_html(html);
  // set
  iframe_wrap.then((wrap) => {
    wrap.exec("set", ["nav_info", { active_page_name: "table" }]);
    wrap.exec("set", ["table_data", data.table_data]);
  });
}
views1();

async function views2() {
  let iframe = document.createElement("iframe");
  iframe.name = JSON.stringify({ context: "testing" });
  let iframe_wrap = util_instance.create_iframe_wrap(iframe);
  iframe.src = "http://localhost:2010";
  iframe.style.width = "420px";
  iframe.style.height = "163px";
  document.body.append(iframe);
  // set
  iframe_wrap.then((wrap) => {
    wrap.exec("set", ["nav_info", { active_page_name: "popup" }]);
  });
}
views2();

/******/ })()
;
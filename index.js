"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var visit = require("unist-util-visit");
var fetch = require("node-fetch");
module.exports = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(_ref, pluginOptions) {
    var markdownAST, nodes;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          markdownAST = _ref.markdownAST;
          nodes = [];
          visit(markdownAST, "paragraph", function (node) {
            if (node.children.length != 3) return;
            var textNode = node.children[0];
            var linkNode = node.children[1];
            if (textNode.type !== "text" || textNode.value.trim() !== "embed-url-code") return;
            if (linkNode.type !== "link") return;
            var lang = node.children[2].value.trim();
            console.log("Fetching url for code block: " + linkNode.url);
            var sourceUrl = linkNode.url.trim();
            var codeUrl = sourceUrl;
            if (codeUrl.toLowerCase().startsWith("https://github.com")) {
              codeUrl = codeUrl.replace("https://github.com", "https://raw.githubusercontent.com").replace("blob/", "");
            }
            if (codeUrl.toLowerCase().startsWith("https://gist.githubusercontent.com")) {
              var paths = codeUrl.replace("https://gist.githubusercontent.com/", "").split("/");
              sourceUrl = "https://gist.github.com/" + paths[0] + "/" + paths[1] + "#" + paths[4];
            }
            var codeNode = {
              type: "code",
              value: codeUrl,
              lang: lang
            };
            node.children = [{
              type: "html",
              value: "\n        <p style=\"color: rebeccapurple;font-style: italic;font-weight: lighter; margin-bottom:0;margin-top:0\">\n          Embedded from <a href='" + sourceUrl + "'>" + sourceUrl + "</a>\n        </p>\n      "
            }, codeNode, {
              type: "html",
              value: "\n        <p style=\"color: rebeccapurple;font-style: italic;font-weight: lighter; margin-top:0; font-size: x-small\">\n          Check the <a href='" + sourceUrl + "'>original code here</a>\n        </p>\n      "
            }];
            nodes.push(codeNode);
          });
          _context2.next = 5;
          return Promise.all(nodes.map( /*#__PURE__*/function () {
            var _ref3 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(node) {
              return _regenerator.default.wrap(function _callee$(_context) {
                while (1) switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return fetch(node.value).then(function (response) {
                      return response.text();
                    });
                  case 2:
                    node.value = _context.sent;
                  case 3:
                  case "end":
                    return _context.stop();
                }
              }, _callee);
            }));
            return function (_x3) {
              return _ref3.apply(this, arguments);
            };
          }()));
        case 5:
          return _context2.abrupt("return", markdownAST);
        case 6:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function (_x, _x2) {
    return _ref2.apply(this, arguments);
  };
}();
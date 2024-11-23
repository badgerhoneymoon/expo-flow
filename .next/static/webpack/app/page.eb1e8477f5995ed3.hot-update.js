"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("app/page",{

/***/ "(app-pages-browser)/./node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js":
/*!**************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js ***!
  \**************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval(__webpack_require__.ts("// This file must be bundled in the app's client layer, it shouldn't be directly\n// imported by the server.\n\nObject.defineProperty(exports, \"__esModule\", ({\n    value: true\n}));\nObject.defineProperty(exports, \"createServerReference\", ({\n    enumerable: true,\n    get: function() {\n        return createServerReference;\n    }\n}));\nconst _appcallserver = __webpack_require__(/*! next/dist/client/app-call-server */ \"(app-pages-browser)/./node_modules/next/dist/client/app-call-server.js\");\nfunction createServerReference(id) {\n    // Since we're using the Edge build of Flight client for SSR [1], here we need to\n    // also use the same Edge build to create the reference. For the client bundle,\n    // we use the default and let Webpack to resolve it to the correct version.\n    // 1: https://github.com/vercel/next.js/blob/16eb80b0b0be13f04a6407943664b5efd8f3d7d0/packages/next/src/server/app-render/use-flight-response.tsx#L24-L26\n    const { createServerReference: createServerReferenceImpl } =  false ? 0 : __webpack_require__(/*! react-server-dom-webpack/client */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react-server-dom-webpack/client.js\");\n    return createServerReferenceImpl(id, _appcallserver.callServer);\n}\n\n//# sourceMappingURL=action-client-wrapper.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL25vZGVfbW9kdWxlcy9uZXh0L2Rpc3QvYnVpbGQvd2VicGFjay9sb2FkZXJzL25leHQtZmxpZ2h0LWxvYWRlci9hY3Rpb24tY2xpZW50LXdyYXBwZXIuanMiLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNhO0FBQ2IsOENBQTZDO0FBQzdDO0FBQ0EsQ0FBQyxFQUFDO0FBQ0YseURBQXdEO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxFQUFDO0FBQ0YsdUJBQXVCLG1CQUFPLENBQUMsZ0hBQWtDO0FBQ2pFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLG1EQUFtRCxFQUFFLE1BQTBCLEdBQUcsQ0FBK0MsR0FBRyxtQkFBTyxDQUFDLGlJQUFpQztBQUN6TDtBQUNBOztBQUVBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vX05fRS8uL25vZGVfbW9kdWxlcy9uZXh0L2Rpc3QvYnVpbGQvd2VicGFjay9sb2FkZXJzL25leHQtZmxpZ2h0LWxvYWRlci9hY3Rpb24tY2xpZW50LXdyYXBwZXIuanM/OWZjNSJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBUaGlzIGZpbGUgbXVzdCBiZSBidW5kbGVkIGluIHRoZSBhcHAncyBjbGllbnQgbGF5ZXIsIGl0IHNob3VsZG4ndCBiZSBkaXJlY3RseVxuLy8gaW1wb3J0ZWQgYnkgdGhlIHNlcnZlci5cblwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiY3JlYXRlU2VydmVyUmVmZXJlbmNlXCIsIHtcbiAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBjcmVhdGVTZXJ2ZXJSZWZlcmVuY2U7XG4gICAgfVxufSk7XG5jb25zdCBfYXBwY2FsbHNlcnZlciA9IHJlcXVpcmUoXCJuZXh0L2Rpc3QvY2xpZW50L2FwcC1jYWxsLXNlcnZlclwiKTtcbmZ1bmN0aW9uIGNyZWF0ZVNlcnZlclJlZmVyZW5jZShpZCkge1xuICAgIC8vIFNpbmNlIHdlJ3JlIHVzaW5nIHRoZSBFZGdlIGJ1aWxkIG9mIEZsaWdodCBjbGllbnQgZm9yIFNTUiBbMV0sIGhlcmUgd2UgbmVlZCB0b1xuICAgIC8vIGFsc28gdXNlIHRoZSBzYW1lIEVkZ2UgYnVpbGQgdG8gY3JlYXRlIHRoZSByZWZlcmVuY2UuIEZvciB0aGUgY2xpZW50IGJ1bmRsZSxcbiAgICAvLyB3ZSB1c2UgdGhlIGRlZmF1bHQgYW5kIGxldCBXZWJwYWNrIHRvIHJlc29sdmUgaXQgdG8gdGhlIGNvcnJlY3QgdmVyc2lvbi5cbiAgICAvLyAxOiBodHRwczovL2dpdGh1Yi5jb20vdmVyY2VsL25leHQuanMvYmxvYi8xNmViODBiMGIwYmUxM2YwNGE2NDA3OTQzNjY0YjVlZmQ4ZjNkN2QwL3BhY2thZ2VzL25leHQvc3JjL3NlcnZlci9hcHAtcmVuZGVyL3VzZS1mbGlnaHQtcmVzcG9uc2UudHN4I0wyNC1MMjZcbiAgICBjb25zdCB7IGNyZWF0ZVNlcnZlclJlZmVyZW5jZTogY3JlYXRlU2VydmVyUmVmZXJlbmNlSW1wbCB9ID0gISFwcm9jZXNzLmVudi5ORVhUX1JVTlRJTUUgPyByZXF1aXJlKFwicmVhY3Qtc2VydmVyLWRvbS13ZWJwYWNrL2NsaWVudC5lZGdlXCIpIDogcmVxdWlyZShcInJlYWN0LXNlcnZlci1kb20td2VicGFjay9jbGllbnRcIik7XG4gICAgcmV0dXJuIGNyZWF0ZVNlcnZlclJlZmVyZW5jZUltcGwoaWQsIF9hcHBjYWxsc2VydmVyLmNhbGxTZXJ2ZXIpO1xufVxuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hY3Rpb24tY2xpZW50LXdyYXBwZXIuanMubWFwIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(app-pages-browser)/./node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js\n"));

/***/ }),

/***/ "(app-pages-browser)/./actions/extract-business-card.ts":
/*!******************************************!*\
  !*** ./actions/extract-business-card.ts ***!
  \******************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   extractBusinessCard: function() { return /* binding */ extractBusinessCard; }
/* harmony export */ });
/* harmony import */ var next_dist_client_app_call_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/client/app-call-server */ "(app-pages-browser)/./node_modules/next/dist/client/app-call-server.js");
/* harmony import */ var next_dist_client_app_call_server__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_client_app_call_server__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var private_next_rsc_action_client_wrapper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! private-next-rsc-action-client-wrapper */ "(app-pages-browser)/./node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js");



function __build_action__(action, args) {
  return (0,next_dist_client_app_call_server__WEBPACK_IMPORTED_MODULE_0__.callServer)(action.$$id, args)
}

/* __next_internal_action_entry_do_not_use__ {"1cea337aaf4647f10068cd39bc103ac81e76c24b":"extractBusinessCard"} */ var extractBusinessCard = (0,private_next_rsc_action_client_wrapper__WEBPACK_IMPORTED_MODULE_1__.createServerReference)("1cea337aaf4647f10068cd39bc103ac81e76c24b");




;
    // Wrapped in an IIFE to avoid polluting the global scope
    ;
    (function () {
        var _a, _b;
        // Legacy CSS implementations will `eval` browser code in a Node.js context
        // to extract CSS. For backwards compatibility, we need to check we're in a
        // browser context before continuing.
        if (typeof self !== 'undefined' &&
            // AMP / No-JS mode does not inject these helpers:
            '$RefreshHelpers$' in self) {
            // @ts-ignore __webpack_module__ is global
            var currentExports = module.exports;
            // @ts-ignore __webpack_module__ is global
            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;
            // This cannot happen in MainTemplate because the exports mismatch between
            // templating and execution.
            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);
            // A module can be accepted automatically based on its exports, e.g. when
            // it is a Refresh Boundary.
            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {
                // Save the previous exports signature on update so we can compare the boundary
                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)
                module.hot.dispose(function (data) {
                    data.prevSignature =
                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);
                });
                // Unconditionally accept an update to this module, we'll check if it's
                // still a Refresh Boundary later.
                // @ts-ignore importMeta is replaced in the loader
                module.hot.accept();
                // This field is set when the previous version of this module was a
                // Refresh Boundary, letting us know we need to check for invalidation or
                // enqueue an update.
                if (prevSignature !== null) {
                    // A boundary can become ineligible if its exports are incompatible
                    // with the previous exports.
                    //
                    // For example, if you add/remove/change exports, we'll want to
                    // re-execute the importing modules, and force those components to
                    // re-render. Similarly, if you convert a class component to a
                    // function, we want to invalidate the boundary.
                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {
                        module.hot.invalidate();
                    }
                    else {
                        self.$RefreshHelpers$.scheduleUpdate();
                    }
                }
            }
            else {
                // Since we just executed the code for the module, it's possible that the
                // new exports made it ineligible for being a boundary.
                // We only care about the case when we were _previously_ a boundary,
                // because we already accepted this update (accidental side effect).
                var isNoLongerABoundary = prevSignature !== null;
                if (isNoLongerABoundary) {
                    module.hot.invalidate();
                }
            }
        }
    })();


/***/ }),

/***/ "(app-pages-browser)/./app/_components/upload-form.tsx":
/*!*****************************************!*\
  !*** ./app/_components/upload-form.tsx ***!
  \*****************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": function() { return /* binding */ UploadForm; }\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/jsx-dev-runtime.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _actions_extract_business_card__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/actions/extract-business-card */ \"(app-pages-browser)/./actions/extract-business-card.ts\");\n/* __next_internal_client_entry_do_not_use__ default auto */ \nvar _s = $RefreshSig$();\n\n\nfunction UploadForm() {\n    _s();\n    const [isProcessing, setIsProcessing] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);\n    const handleImageUpload = async (file)=>{\n        setIsProcessing(true);\n        try {\n            // Convert image to base64\n            const reader = new FileReader();\n            reader.readAsDataURL(file);\n            reader.onload = async ()=>{\n                const base64String = reader.result.split(\",\")[1];\n                const result = await (0,_actions_extract_business_card__WEBPACK_IMPORTED_MODULE_2__.extractBusinessCard)(base64String);\n                if (result.success && result.data) {\n                    // Handle the structured data\n                    console.log(\"Extracted data:\", result.data);\n                } else {\n                    console.error(\"Extraction failed:\", result.error);\n                }\n            };\n        } catch (error) {\n            console.error(\"Upload error:\", error);\n        } finally{\n            setIsProcessing(false);\n        }\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"input\", {\n                type: \"file\",\n                accept: \"image/*\",\n                onChange: (e)=>{\n                    var _e_target_files;\n                    return ((_e_target_files = e.target.files) === null || _e_target_files === void 0 ? void 0 : _e_target_files[0]) && handleImageUpload(e.target.files[0]);\n                },\n                disabled: isProcessing\n            }, void 0, false, {\n                fileName: \"/Users/denisburkatskiy/Python/Expo_Flow/app/_components/upload-form.tsx\",\n                lineNumber: 37,\n                columnNumber: 7\n            }, this),\n            isProcessing && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                children: \"Processing...\"\n            }, void 0, false, {\n                fileName: \"/Users/denisburkatskiy/Python/Expo_Flow/app/_components/upload-form.tsx\",\n                lineNumber: 43,\n                columnNumber: 24\n            }, this)\n        ]\n    }, void 0, true, {\n        fileName: \"/Users/denisburkatskiy/Python/Expo_Flow/app/_components/upload-form.tsx\",\n        lineNumber: 36,\n        columnNumber: 5\n    }, this);\n}\n_s(UploadForm, \"23doSrFnpDt6GWBaV15L/gfAQhY=\");\n_c = UploadForm;\nvar _c;\n$RefreshReg$(_c, \"UploadForm\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL2FwcC9fY29tcG9uZW50cy91cGxvYWQtZm9ybS50c3giLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUVpQztBQUNxQztBQUV2RCxTQUFTRTs7SUFDdEIsTUFBTSxDQUFDQyxjQUFjQyxnQkFBZ0IsR0FBR0osK0NBQVFBLENBQUM7SUFFakQsTUFBTUssb0JBQW9CLE9BQU9DO1FBQy9CRixnQkFBZ0I7UUFFaEIsSUFBSTtZQUNGLDBCQUEwQjtZQUMxQixNQUFNRyxTQUFTLElBQUlDO1lBQ25CRCxPQUFPRSxhQUFhLENBQUNIO1lBRXJCQyxPQUFPRyxNQUFNLEdBQUc7Z0JBQ2QsTUFBTUMsZUFBZSxPQUFRQyxNQUFNLENBQVlDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDNUQsTUFBTUQsU0FBUyxNQUFNWCxtRkFBbUJBLENBQUNVO2dCQUV6QyxJQUFJQyxPQUFPRSxPQUFPLElBQUlGLE9BQU9HLElBQUksRUFBRTtvQkFDakMsNkJBQTZCO29CQUM3QkMsUUFBUUMsR0FBRyxDQUFDLG1CQUFtQkwsT0FBT0csSUFBSTtnQkFDNUMsT0FBTztvQkFDTEMsUUFBUUUsS0FBSyxDQUFDLHNCQUFzQk4sT0FBT00sS0FBSztnQkFDbEQ7WUFDRjtRQUNGLEVBQUUsT0FBT0EsT0FBTztZQUNkRixRQUFRRSxLQUFLLENBQUMsaUJBQWlCQTtRQUNqQyxTQUFVO1lBQ1JkLGdCQUFnQjtRQUNsQjtJQUNGO0lBRUEscUJBQ0UsOERBQUNlOzswQkFDQyw4REFBQ0M7Z0JBQ0NDLE1BQUs7Z0JBQ0xDLFFBQU87Z0JBQ1BDLFVBQVUsQ0FBQ0M7d0JBQU1BOzJCQUFBQSxFQUFBQSxrQkFBQUEsRUFBRUMsTUFBTSxDQUFDQyxLQUFLLGNBQWRGLHNDQUFBQSxlQUFnQixDQUFDLEVBQUUsS0FBSW5CLGtCQUFrQm1CLEVBQUVDLE1BQU0sQ0FBQ0MsS0FBSyxDQUFDLEVBQUU7O2dCQUMzRUMsVUFBVXhCOzs7Ozs7WUFFWEEsOEJBQWdCLDhEQUFDZ0I7MEJBQUk7Ozs7Ozs7Ozs7OztBQUc1QjtHQXhDd0JqQjtLQUFBQSIsInNvdXJjZXMiOlsid2VicGFjazovL19OX0UvLi9hcHAvX2NvbXBvbmVudHMvdXBsb2FkLWZvcm0udHN4PzM3ZmIiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2UgY2xpZW50XCJcblxuaW1wb3J0IHsgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBleHRyYWN0QnVzaW5lc3NDYXJkIH0gZnJvbSAnQC9hY3Rpb25zL2V4dHJhY3QtYnVzaW5lc3MtY2FyZCc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFVwbG9hZEZvcm0oKSB7XG4gIGNvbnN0IFtpc1Byb2Nlc3NpbmcsIHNldElzUHJvY2Vzc2luZ10gPSB1c2VTdGF0ZShmYWxzZSk7XG5cbiAgY29uc3QgaGFuZGxlSW1hZ2VVcGxvYWQgPSBhc3luYyAoZmlsZTogRmlsZSkgPT4ge1xuICAgIHNldElzUHJvY2Vzc2luZyh0cnVlKTtcbiAgICBcbiAgICB0cnkge1xuICAgICAgLy8gQ29udmVydCBpbWFnZSB0byBiYXNlNjRcbiAgICAgIGNvbnN0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG4gICAgICByZWFkZXIucmVhZEFzRGF0YVVSTChmaWxlKTtcbiAgICAgIFxuICAgICAgcmVhZGVyLm9ubG9hZCA9IGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc3QgYmFzZTY0U3RyaW5nID0gKHJlYWRlci5yZXN1bHQgYXMgc3RyaW5nKS5zcGxpdCgnLCcpWzFdO1xuICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBleHRyYWN0QnVzaW5lc3NDYXJkKGJhc2U2NFN0cmluZyk7XG4gICAgICAgIFxuICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MgJiYgcmVzdWx0LmRhdGEpIHtcbiAgICAgICAgICAvLyBIYW5kbGUgdGhlIHN0cnVjdHVyZWQgZGF0YVxuICAgICAgICAgIGNvbnNvbGUubG9nKCdFeHRyYWN0ZWQgZGF0YTonLCByZXN1bHQuZGF0YSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcignRXh0cmFjdGlvbiBmYWlsZWQ6JywgcmVzdWx0LmVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcignVXBsb2FkIGVycm9yOicsIGVycm9yKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgc2V0SXNQcm9jZXNzaW5nKGZhbHNlKTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2PlxuICAgICAgPGlucHV0IFxuICAgICAgICB0eXBlPVwiZmlsZVwiIFxuICAgICAgICBhY2NlcHQ9XCJpbWFnZS8qXCJcbiAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBlLnRhcmdldC5maWxlcz8uWzBdICYmIGhhbmRsZUltYWdlVXBsb2FkKGUudGFyZ2V0LmZpbGVzWzBdKX1cbiAgICAgICAgZGlzYWJsZWQ9e2lzUHJvY2Vzc2luZ31cbiAgICAgIC8+XG4gICAgICB7aXNQcm9jZXNzaW5nICYmIDxkaXY+UHJvY2Vzc2luZy4uLjwvZGl2Pn1cbiAgICA8L2Rpdj5cbiAgKTtcbn0gIl0sIm5hbWVzIjpbInVzZVN0YXRlIiwiZXh0cmFjdEJ1c2luZXNzQ2FyZCIsIlVwbG9hZEZvcm0iLCJpc1Byb2Nlc3NpbmciLCJzZXRJc1Byb2Nlc3NpbmciLCJoYW5kbGVJbWFnZVVwbG9hZCIsImZpbGUiLCJyZWFkZXIiLCJGaWxlUmVhZGVyIiwicmVhZEFzRGF0YVVSTCIsIm9ubG9hZCIsImJhc2U2NFN0cmluZyIsInJlc3VsdCIsInNwbGl0Iiwic3VjY2VzcyIsImRhdGEiLCJjb25zb2xlIiwibG9nIiwiZXJyb3IiLCJkaXYiLCJpbnB1dCIsInR5cGUiLCJhY2NlcHQiLCJvbkNoYW5nZSIsImUiLCJ0YXJnZXQiLCJmaWxlcyIsImRpc2FibGVkIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(app-pages-browser)/./app/_components/upload-form.tsx\n"));

/***/ })

});
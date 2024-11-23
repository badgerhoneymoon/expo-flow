/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("app/page",{

/***/ "(app-pages-browser)/./actions/extract-business-card.ts":
/*!******************************************!*\
  !*** ./actions/extract-business-card.ts ***!
  \******************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {



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

"use strict";
eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": function() { return /* binding */ UploadForm; }\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/jsx-dev-runtime.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _actions_extract_business_card__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/actions/extract-business-card */ \"(app-pages-browser)/./actions/extract-business-card.ts\");\n/* harmony import */ var _actions_extract_business_card__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_actions_extract_business_card__WEBPACK_IMPORTED_MODULE_2__);\n/* __next_internal_client_entry_do_not_use__ default auto */ \nvar _s = $RefreshSig$();\n\n\nfunction UploadForm() {\n    _s();\n    const [isProcessing, setIsProcessing] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);\n    const handleImageUpload = async (file)=>{\n        setIsProcessing(true);\n        try {\n            // Convert image to base64\n            const reader = new FileReader();\n            reader.readAsDataURL(file);\n            reader.onload = async ()=>{\n                const base64String = reader.result.split(\",\")[1];\n                const result = await (0,_actions_extract_business_card__WEBPACK_IMPORTED_MODULE_2__.extractBusinessCard)(base64String);\n                if (result.success && result.data) {\n                    // Handle the structured data\n                    console.log(\"Extracted data:\", result.data);\n                } else {\n                    console.error(\"Extraction failed:\", result.error);\n                }\n            };\n        } catch (error) {\n            console.error(\"Upload error:\", error);\n        } finally{\n            setIsProcessing(false);\n        }\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"input\", {\n                type: \"file\",\n                accept: \"image/*\",\n                onChange: (e)=>{\n                    var _e_target_files;\n                    return ((_e_target_files = e.target.files) === null || _e_target_files === void 0 ? void 0 : _e_target_files[0]) && handleImageUpload(e.target.files[0]);\n                },\n                disabled: isProcessing\n            }, void 0, false, {\n                fileName: \"/Users/denisburkatskiy/Python/Expo_Flow/app/_components/upload-form.tsx\",\n                lineNumber: 37,\n                columnNumber: 7\n            }, this),\n            isProcessing && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                children: \"Processing...\"\n            }, void 0, false, {\n                fileName: \"/Users/denisburkatskiy/Python/Expo_Flow/app/_components/upload-form.tsx\",\n                lineNumber: 43,\n                columnNumber: 24\n            }, this)\n        ]\n    }, void 0, true, {\n        fileName: \"/Users/denisburkatskiy/Python/Expo_Flow/app/_components/upload-form.tsx\",\n        lineNumber: 36,\n        columnNumber: 5\n    }, this);\n}\n_s(UploadForm, \"23doSrFnpDt6GWBaV15L/gfAQhY=\");\n_c = UploadForm;\nvar _c;\n$RefreshReg$(_c, \"UploadForm\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL2FwcC9fY29tcG9uZW50cy91cGxvYWQtZm9ybS50c3giLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFFaUM7QUFDcUM7QUFFdkQsU0FBU0U7O0lBQ3RCLE1BQU0sQ0FBQ0MsY0FBY0MsZ0JBQWdCLEdBQUdKLCtDQUFRQSxDQUFDO0lBRWpELE1BQU1LLG9CQUFvQixPQUFPQztRQUMvQkYsZ0JBQWdCO1FBRWhCLElBQUk7WUFDRiwwQkFBMEI7WUFDMUIsTUFBTUcsU0FBUyxJQUFJQztZQUNuQkQsT0FBT0UsYUFBYSxDQUFDSDtZQUVyQkMsT0FBT0csTUFBTSxHQUFHO2dCQUNkLE1BQU1DLGVBQWUsT0FBUUMsTUFBTSxDQUFZQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQzVELE1BQU1ELFNBQVMsTUFBTVgsbUZBQW1CQSxDQUFDVTtnQkFFekMsSUFBSUMsT0FBT0UsT0FBTyxJQUFJRixPQUFPRyxJQUFJLEVBQUU7b0JBQ2pDLDZCQUE2QjtvQkFDN0JDLFFBQVFDLEdBQUcsQ0FBQyxtQkFBbUJMLE9BQU9HLElBQUk7Z0JBQzVDLE9BQU87b0JBQ0xDLFFBQVFFLEtBQUssQ0FBQyxzQkFBc0JOLE9BQU9NLEtBQUs7Z0JBQ2xEO1lBQ0Y7UUFDRixFQUFFLE9BQU9BLE9BQU87WUFDZEYsUUFBUUUsS0FBSyxDQUFDLGlCQUFpQkE7UUFDakMsU0FBVTtZQUNSZCxnQkFBZ0I7UUFDbEI7SUFDRjtJQUVBLHFCQUNFLDhEQUFDZTs7MEJBQ0MsOERBQUNDO2dCQUNDQyxNQUFLO2dCQUNMQyxRQUFPO2dCQUNQQyxVQUFVLENBQUNDO3dCQUFNQTsyQkFBQUEsRUFBQUEsa0JBQUFBLEVBQUVDLE1BQU0sQ0FBQ0MsS0FBSyxjQUFkRixzQ0FBQUEsZUFBZ0IsQ0FBQyxFQUFFLEtBQUluQixrQkFBa0JtQixFQUFFQyxNQUFNLENBQUNDLEtBQUssQ0FBQyxFQUFFOztnQkFDM0VDLFVBQVV4Qjs7Ozs7O1lBRVhBLDhCQUFnQiw4REFBQ2dCOzBCQUFJOzs7Ozs7Ozs7Ozs7QUFHNUI7R0F4Q3dCakI7S0FBQUEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9fTl9FLy4vYXBwL19jb21wb25lbnRzL3VwbG9hZC1mb3JtLnRzeD8zN2ZiIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIGNsaWVudFwiXG5cbmltcG9ydCB7IHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgZXh0cmFjdEJ1c2luZXNzQ2FyZCB9IGZyb20gJ0AvYWN0aW9ucy9leHRyYWN0LWJ1c2luZXNzLWNhcmQnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBVcGxvYWRGb3JtKCkge1xuICBjb25zdCBbaXNQcm9jZXNzaW5nLCBzZXRJc1Byb2Nlc3NpbmddID0gdXNlU3RhdGUoZmFsc2UpO1xuXG4gIGNvbnN0IGhhbmRsZUltYWdlVXBsb2FkID0gYXN5bmMgKGZpbGU6IEZpbGUpID0+IHtcbiAgICBzZXRJc1Byb2Nlc3NpbmcodHJ1ZSk7XG4gICAgXG4gICAgdHJ5IHtcbiAgICAgIC8vIENvbnZlcnQgaW1hZ2UgdG8gYmFzZTY0XG4gICAgICBjb25zdCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgICAgcmVhZGVyLnJlYWRBc0RhdGFVUkwoZmlsZSk7XG4gICAgICBcbiAgICAgIHJlYWRlci5vbmxvYWQgPSBhc3luYyAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGJhc2U2NFN0cmluZyA9IChyZWFkZXIucmVzdWx0IGFzIHN0cmluZykuc3BsaXQoJywnKVsxXTtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgZXh0cmFjdEJ1c2luZXNzQ2FyZChiYXNlNjRTdHJpbmcpO1xuICAgICAgICBcbiAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzICYmIHJlc3VsdC5kYXRhKSB7XG4gICAgICAgICAgLy8gSGFuZGxlIHRoZSBzdHJ1Y3R1cmVkIGRhdGFcbiAgICAgICAgICBjb25zb2xlLmxvZygnRXh0cmFjdGVkIGRhdGE6JywgcmVzdWx0LmRhdGEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0V4dHJhY3Rpb24gZmFpbGVkOicsIHJlc3VsdC5lcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1VwbG9hZCBlcnJvcjonLCBlcnJvcik7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHNldElzUHJvY2Vzc2luZyhmYWxzZSk7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiAoXG4gICAgPGRpdj5cbiAgICAgIDxpbnB1dCBcbiAgICAgICAgdHlwZT1cImZpbGVcIiBcbiAgICAgICAgYWNjZXB0PVwiaW1hZ2UvKlwiXG4gICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gZS50YXJnZXQuZmlsZXM/LlswXSAmJiBoYW5kbGVJbWFnZVVwbG9hZChlLnRhcmdldC5maWxlc1swXSl9XG4gICAgICAgIGRpc2FibGVkPXtpc1Byb2Nlc3Npbmd9XG4gICAgICAvPlxuICAgICAge2lzUHJvY2Vzc2luZyAmJiA8ZGl2PlByb2Nlc3NpbmcuLi48L2Rpdj59XG4gICAgPC9kaXY+XG4gICk7XG59ICJdLCJuYW1lcyI6WyJ1c2VTdGF0ZSIsImV4dHJhY3RCdXNpbmVzc0NhcmQiLCJVcGxvYWRGb3JtIiwiaXNQcm9jZXNzaW5nIiwic2V0SXNQcm9jZXNzaW5nIiwiaGFuZGxlSW1hZ2VVcGxvYWQiLCJmaWxlIiwicmVhZGVyIiwiRmlsZVJlYWRlciIsInJlYWRBc0RhdGFVUkwiLCJvbmxvYWQiLCJiYXNlNjRTdHJpbmciLCJyZXN1bHQiLCJzcGxpdCIsInN1Y2Nlc3MiLCJkYXRhIiwiY29uc29sZSIsImxvZyIsImVycm9yIiwiZGl2IiwiaW5wdXQiLCJ0eXBlIiwiYWNjZXB0Iiwib25DaGFuZ2UiLCJlIiwidGFyZ2V0IiwiZmlsZXMiLCJkaXNhYmxlZCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(app-pages-browser)/./app/_components/upload-form.tsx\n"));

/***/ })

});
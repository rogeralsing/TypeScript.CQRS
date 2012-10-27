export module Weaver {
    export function makeInterceptType(type: any) {
        var typeName = getFunctionName(type);

        for (var item in type.prototype) {
            var methodName = item.toString();
            if (endsWith(methodName, "Event")) {
                makeInterceptMethod(typeName, methodName, type.prototype);
            }
        }
    }

    function makeInterceptMethod(typeName: string, methodName: string, target: any) {
        var tmp = target[methodName];
        var paramNames = getParamNames(tmp);

        target[methodName] = function () {

            var jsonObj = {};
            var jsonArgs = {};

            if (paramNames != null) {
                for (var i = 0; i < paramNames.length; i++) {
                    jsonArgs[paramNames[i]] = arguments[i];
                }
            }

            var eventName = typeName + "." + methodName;
            jsonObj[eventName] = jsonArgs;
            jsonObj["id"] = this["_id"];

            var jsonStr = JSON.stringify(jsonObj);

            tmp.apply(this, arguments);
            this.store(jsonStr);
        };
    }

    function getParamNames(func) {
        var funStr = func.toString();
        return funStr.slice(funStr.indexOf('(') + 1, funStr.indexOf(')')).match(/([^\s,]+)/g);
    }

    function getFunctionName(func) {
        var funStr = func.toString();
        return funStr.slice(funStr.indexOf(' ') + 1, funStr.indexOf('(')).match(/([^\s,]+)/g);
    }

    function endsWith(str, suffix) {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    }
}
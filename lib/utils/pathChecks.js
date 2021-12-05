import {types as t} from "@babel/core";

export function isStateVariableDeclarator(path) {
    return t.isCallExpression(path.node.init) && path.node.init.callee.name === "useState";
}
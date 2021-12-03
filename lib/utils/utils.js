import * as t from "@babel/types";

/**
 * @param {string} propName
 * @return {`__set__${string}`}
 */
export const getPropertySetter = (propName) => `__set__${propName}`;

/**
 * @param {string} propName
 * @return {boolean}
 */
export const isReactiveProp = (propName) => propName && propName.startsWith("$");

/**
 * @param {string} kind
 * @param {string} name
 * @return {boolean}
 */
export const isReactivePropDeclaration = (kind, name) => {
    return kind && name && kind === "let" && name.startsWith("$");
};

/**
 * @param node
 * @return {{ kind: string, name: string }}
 */
export const getVariableDeclarationInfo = (node) => ({
    name: node.declarations[0].id.name,
    kind: node.kind
});

export function isJsxFunction(path) {
    // todo works only if return is JSX
    //  check also for variables, multiple returns etc.
    //  better to directly see if variable is used in jsx
    const functionBody = path.node.body.body;
    const ret = functionBody.find(vd => t.isReturnStatement(vd));
    if (ret) {
        return t.isJSXElement(ret.argument);
    }

    return false;
}
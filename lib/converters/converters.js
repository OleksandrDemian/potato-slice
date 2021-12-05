import { types as t } from "@babel/types";
import {getPropertySetter, isReactiveProp} from "../utils/utils";

/**
 * @param {string} name
 * @param path
 * @return {VariableDeclaration}
 */
export function valueToState (name, path) {
    const initAst = path.node.declarations[0].init;
    return t.variableDeclaration('const', [
        t.variableDeclarator(
            t.arrayPattern([
                t.identifier(name),
                t.identifier(getPropertySetter(name)),
            ]),
            t.callExpression(
                t.identifier("useState"),
                [
                    initAst
                ]
            ),
        ),
    ]);
}

/**
 * @param {string} name
 * @param {BinaryExpression} exp
 * @return {CallExpression}
 */
export function assignmentToCallExpression(name, exp) {
    return t.callExpression(
        t.identifier(getPropertySetter(name)),
        [
            t.arrowFunctionExpression(
                [
                    t.identifier(name)
                ],
                exp,
            ),
        ],
    );
}

/**
 * @param {string} name
 * @param path
 * @param {{ context }} opts
 * @return {VariableDeclaration}
 */
export function valueToMemo (name, path, opts) {
    const initAst = path.node.declarations[0].init;
    const dependencies = [];
    path.traverse({
        Identifier (path) {
            const foundName = path.node.name;
            if (foundName !== name && isReactiveProp(foundName)) {
                const isDependencyProp = opts.context.reactiveVariables.find(prop => prop.name === foundName);
                if (isDependencyProp) {
                    dependencies.push(foundName);
                }
            }
        }
    });

    return t.variableDeclaration('const', [
        t.variableDeclarator(
            t.identifier(name),
            t.callExpression(
                t.identifier("useMemo"),
                [
                    t.arrowFunctionExpression(
                        [],
                        initAst,
                    ),
                    t.arrayExpression([
                        ...dependencies.map(dep => t.identifier(dep)),
                    ]),
                ],
            ),
        ),
    ]);
}

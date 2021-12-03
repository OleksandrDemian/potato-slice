import * as t from "@babel/types";
import {getPropertySetter} from "./utils/utils";

/**
 * @param {string} name
 * @param {(Expression | SpreadElement | JSXNamespacedName | ArgumentPlaceholder)} initAst
 * @return {VariableDeclaration}
 */
export function valueToState (name, initAst) {
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
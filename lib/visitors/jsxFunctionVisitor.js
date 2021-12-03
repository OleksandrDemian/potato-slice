import * as t from "@babel/types";
import {assignmentToCallExpression, valueToState} from "../converters";
import {getVariableDeclarationInfo, isReactiveProp, isReactivePropDeclaration} from "../utils";

export function jsxFunctionVisitor() {
    return {
        VariableDeclaration(path) {
            const { kind, name } = getVariableDeclarationInfo(path.node);
            if (isReactivePropDeclaration(kind, name)) {
                path.replaceWith(
                    valueToState(name, path.node.declarations[0].init)
                );
            }
        },
        AssignmentExpression(path) {
            const name = path.node.left.name;
            if (isReactiveProp(name)) {
                const op = path.node.operator;
                if (op === "=") {
                    path.replaceWith(
                        assignmentToCallExpression(name, path.node.right),
                    );
                } else if (op === "+=" || op === "-=" || op === "*=" || op === "/=") {
                    const operator = op.charAt(0);
                    path.replaceWith(
                        assignmentToCallExpression(
                            name,
                            t.binaryExpression(
                                operator,
                                t.identifier(name),
                                path.node.right
                            ),
                        ),
                    );
                }
            }
        },
        UpdateExpression(path) {
            const name = path.node.argument.name;
            if (isReactiveProp(name)) {
                const op = path.node.operator;
                path.replaceWith(
                    assignmentToCallExpression(
                        name,
                        t.binaryExpression(
                            op.charAt(0),
                            t.identifier(name),
                            t.numericLiteral(1)
                        ),
                    ),
                );
            }
        }
    }
}
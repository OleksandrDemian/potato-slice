import { types as t } from "@babel/types";
import {assignmentToCallExpression, valueToMemo, valueToState} from "../../converters/converters";
import {
    findReactiveVariables,
    getVariableDeclarationInfo,
    isMemoPropDeclaration,
    isReactiveProp,
    isReactivePropDeclaration
} from "../../utils/utils";
import {getImportStateHandler, USE_MEMO, USE_STATE} from "../../utils/importsHandler";

export const OPERATION_ASSIGNMENT = [ "+=", "-=", "*=", "/=" ];

/**
 * @param {{ currentRoot, currentFunction }} opts
 */
export function createFunctionVisitor(opts) {
    const { currentRoot } = opts;
    const functionContext = {
        ...opts,
        reactiveVariables: findReactiveVariables(opts.currentFunction),
    };

    const importHandler = getImportStateHandler({ root: currentRoot });

    return {
        VariableDeclaration(path) {
            const { kind, name } = getVariableDeclarationInfo(path.node);
            if (isReactivePropDeclaration(kind, name)) {
                if (!path.isState) {
                    path.replaceWith(
                        valueToState(name, path),
                    );
                    path.isState = true;

                    importHandler.addImportIfMissing(USE_STATE);
                }
            } else if (isMemoPropDeclaration(kind, name)) {
                if (!path.isMemo) {
                    path.replaceWith(
                        valueToMemo(name, path, {
                            context: functionContext,
                        }),
                    );
                    path.isMemo = true;

                    importHandler.addImportIfMissing(USE_MEMO);
                }
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
                } else if (OPERATION_ASSIGNMENT.includes(op)) {
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

                importHandler.addImportIfMissing(USE_STATE);
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
                importHandler.addImportIfMissing(USE_STATE);
            }
        }
    }
}
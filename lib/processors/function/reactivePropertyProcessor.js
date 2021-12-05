import {
    getVariableDeclarationInfo,
    isReactiveProp,
    isReactivePropDeclaration
} from "../../utils/utils";
import {assignmentToCallExpression, valueToState} from "../../converters/converters";
import {getImportStateHandler, USE_STATE} from "../../utils/importsHandler";
import {types as t} from "@babel/core";

const OPERATION_ASSIGNMENT = ["+=", "-=", "*=", "/="];

export const processReactiveProperties = (path, { currentRoot }) => {
    console.log("Processing reactive properties");

    const importHandler = getImportStateHandler({ root: currentRoot });

    path.traverse({
        VariableDeclaration(path) {
            const { kind, name } = getVariableDeclarationInfo(path.node);
            // todo: move to pathChecks
            if (isReactivePropDeclaration(kind, name)) {
                if (!path.isState) {
                    path.replaceWith(
                        valueToState(name, path),
                    );
                    path.isState = true;

                    importHandler.addImportIfMissing(USE_STATE);
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
    });
}
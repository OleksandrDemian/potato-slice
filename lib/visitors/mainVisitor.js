import {isUpperCaseString} from "../utils/utils";
import {jsxFunctionVisitor} from "./jsxFunctionVisitor";

function shouldVisitFunction(path) {
    // todo: better check if function should be processed
    // return isProgram(path.parent) && (isUpperCaseString(name.charAt(0)) || name.startsWith("use"));

    const name = path.node.id.name;
    return (isUpperCaseString(name.charAt(0)) || name.startsWith("use"));
}

export function mainVisitor() {
    const state = {
        currentRoot: null,
        currentFunction: null,
    }

    return {
        Program (path) {
            state.currentRoot = path;
        },
        FunctionDeclaration (path) {
            if (shouldVisitFunction(path)) {
                state.currentFunction = path;
                path.traverse(jsxFunctionVisitor(state));
            }
        }
    }
}

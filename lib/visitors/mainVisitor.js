import {isJsxFunction} from "../utils/utils";
import {jsxFunctionVisitor} from "./jsxFunctionVisitor";

export function mainVisitor() {
    const state = {
        currentRoot: null,
    }

    return {
        Program (path) {
            state.currentRoot = path;
        },
        FunctionDeclaration (path) {
            if (isJsxFunction(path)) {
                path.traverse(jsxFunctionVisitor(state));
            }
        }
    }
}
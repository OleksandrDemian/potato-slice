import {isJsxFunction} from "../utils";
import {jsxFunctionVisitor} from "./jsxFunctionVisitor";

export function mainVisitor() {
    return {
        FunctionDeclaration: (path) => {
            if (isJsxFunction(path)) {
                path.traverse(jsxFunctionVisitor());
            }
        }
    }
}
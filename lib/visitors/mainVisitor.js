import {isUpperCaseString} from "../utils/utils";
import {jsxFunctionVisitor} from "./jsxFunctionVisitor";
import {isProgram} from "@babel/types";

function shouldVisitFunction(path) {
    // todo: better check if function should be processed
    const name = path.node.id.name;
    return isProgram(path.parent) && (isUpperCaseString(name.charAt(0)) || name.startsWith("use"));
}

export function mainVisitor() {
    const state = {
        currentRoot: null,
    }

    return {
        Program (path) {
            state.currentRoot = path;
        },
        FunctionDeclaration (path) {
            if (shouldVisitFunction(path)) {
                console.log(`Found ${path.node.id.name}`);
                path.traverse(jsxFunctionVisitor(state));
            }
        }
    }
}

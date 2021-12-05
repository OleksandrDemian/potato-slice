import {isUpperCaseString} from "../../utils/utils";
import {processFunction} from "../../processors/function";

function shouldProcessFunction(path) {
    // todo: better check if function should be processed
    const name = path.node.id.name;
    return (isUpperCaseString(name.charAt(0)) || name.startsWith("use"));
}

export function createProgramVisitor({ programPath }) {
    const state = {
        currentRoot: programPath,
        currentFunction: null,
    }

    return {
        FunctionDeclaration (path) {
            if (shouldProcessFunction(path)) {
                state.currentFunction = path;
                processFunction(path, state);
            }
        }
    }
}
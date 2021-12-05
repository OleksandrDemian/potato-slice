import {readNameFromStateDeclarator} from "./readers";
import {isStateVariableDeclarator} from "./pathChecks";

export function findReactiveProperties(currentFunctionPath) {
    const reactiveProperties = [];
    currentFunctionPath.traverse({
        VariableDeclarator (path) {
            if (isStateVariableDeclarator(path)) {
                reactiveProperties.push({
                    kind: path.parent.kind,
                    name: readNameFromStateDeclarator(path.node),
                });
            }
        }
    });

    return reactiveProperties;
}

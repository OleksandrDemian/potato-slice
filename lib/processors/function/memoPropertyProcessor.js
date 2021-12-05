import {getVariableDeclarationInfo, isMemoPropDeclaration} from "../../utils/utils";
import {valueToMemo} from "../../converters/converters";
import {getImportStateHandler, USE_MEMO} from "../../utils/importsHandler";
import {findReactiveProperties} from "../../utils/findReactiveProperties";

export const processMemoProperties = (path, { currentRoot, currentFunction }) => {
    console.log("Processing memo properties");

    const importHandler = getImportStateHandler({ root: currentRoot });
    const context = {
        reactiveProperties: findReactiveProperties(currentFunction)
    };
    console.log(JSON.stringify(context));

    path.traverse({
        VariableDeclaration(path) {
            const { kind, name } = getVariableDeclarationInfo(path.node);
            if (isMemoPropDeclaration(kind, name)) {
                if (!path.isMemo) {
                    path.replaceWith(
                        valueToMemo(name, path, {
                            context,
                        }),
                    );
                    path.isMemo = true;

                    importHandler.addImportIfMissing(USE_MEMO);
                }
            }
        },
    });
}
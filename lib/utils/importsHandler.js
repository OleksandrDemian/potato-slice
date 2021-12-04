import template from "@babel/template";

/**
 * @param {string} lib
 */
const buildImport = (lib) => template(`
  import { ${lib} } from "react";
`)();

export const USE_STATE = "useState";
export const USE_MEMO = "useMemo";

export function getImportStateHandler({ root }) {
    const importsDone = {};
    root.traverse({
        ImportSpecifier (path) {
            const imp = path.node.local.name;
        },
        ImportDefaultSpecifier (path) {
            const imp = path.node.local.name;
        },
        ImportNamespaceSpecifier (path) {
            const imp = path.node.local.name;
        },
    });

    function addImportIfMissing(lib) {
        if (!importsDone[lib]) {
            console.log("Import " + lib);
            importsDone[lib] = true;
            root.unshiftContainer('body', buildImport(lib));
        }
    }

    return {
        addImportIfMissing,
    }
}
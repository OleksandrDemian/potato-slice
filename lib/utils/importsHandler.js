import template from "@babel/template";

/**
 * @param {string} lib
 */
const buildImport = (lib) => template(`
  import { ${lib} } from "react";
`)();

export const USE_STATE = "useState";

export function getImportStateHandler({ root }) {
    const importsDone = {};

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
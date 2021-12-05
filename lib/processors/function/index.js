import {processMemoProperties} from "./memoPropertyProcessor";
import {processReactiveProperties} from "./reactivePropertyProcessor";

const processors = [
    {
        fn: processReactiveProperties,
    },
    {
        fn: processMemoProperties,
    }
];

/**
 * @param path
 * @param {{ currentRoot, currentFunction }} context
 */
export const processFunction = (path, context) => {
    const functionContext = {
        ...context,
    }

    for (const processor of processors) {
        processor.fn(path, functionContext);
    }
};

/**
 * @param {{ fn }} entry
 */
export const addFunctionProcessor = (entry) => {
    processors.push(entry);
}
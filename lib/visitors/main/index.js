import { createProgramVisitor } from "../program";

export function createMainVisitor () {
    return {
        Program (path) {
            path.traverse({
                visitor: createProgramVisitor({
                    programPath: path
                }),
            });
        }
    }
}

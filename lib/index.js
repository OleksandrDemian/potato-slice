// TODO: USE BABEL LIBRARY INSTEAD OF MAKING THIS AS PLUGIN
import { declare } from "@babel/helper-plugin-utils";
import {createMainVisitor} from "./visitors/main";

export default declare(({ assertVersion }) => {
    assertVersion(7);

    return {
        name: "potato-slice",
        visitor: createMainVisitor(),
    }
});
// TODO: USE BABEL LIBRARY INSTEAD OF MAKING THIS AS PLUGIN
import {mainVisitor} from "./visitors/mainVisitor";

export default function () {
    return {
        visitor: mainVisitor(),
    };
}
export const readNameFromStateDeclarator = (node) => {
    return node.id.elements[0].name;
}

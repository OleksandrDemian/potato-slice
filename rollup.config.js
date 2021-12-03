const EXTERNAL = [
    "@babel/types",
    "@babel/template",
];

export default {
    input: './index.js',
    external: EXTERNAL,
    output: [
        {
            file: 'dist/bundle.cjs.js',
            format: 'cjs',
        },
        {
            file: 'dist/bundle.es.js',
            format: 'es',
        },
    ]
};
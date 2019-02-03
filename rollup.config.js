import resolve from 'rollup-plugin-node-resolve'
import builtins from 'rollup-plugin-node-builtins'
import globals from 'rollup-plugin-node-globals'
import postcss from 'rollup-plugin-postcss'

export default [
    {
        context: 'window',
        input: 'src/main.js',
        output: [
            {
                file: 'build/main.bundle.iife.js', // All in one file
                format: 'iife'
            }
        ],
        plugins: [
            resolve(
                // { modulesOnly: true }
            ),
            globals(),
            builtins(),
            postcss({
                plugins: []
            })
        ]
    }
    // ,// ES6 in browser route...skip 4 now
    // {
    //   input: 'src/main.js',
    //   output: [
    //     {
    //       file: 'build/main.bundle.esm.js',
    //       format: 'esm'
    //     }
    //   ],
    //   external: ['lit-element']
    // },
    // {
    //   input: 'node_modules/lit-element/lit-element.js',
    //   output: {
    //     format: 'iife',
    //     file: 'build/lit-element.js',
    //     name: 'lit-element'
    //   }
    // }
]

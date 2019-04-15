import resolve from 'rollup-plugin-node-resolve'
import builtins from 'rollup-plugin-node-builtins'
import globals from 'rollup-plugin-node-globals'
// import scss from 'rollup-plugin-scss'
import sass from 'rollup-plugin-sass'
import autoprefixer from 'autoprefixer'
// import postcss from 'rollup-plugin-postcss'
import postcss from 'postcss'

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
            resolve({
                module: true
            }
                // { modulesOnly: true }
            ),
            globals(),
            builtins(),
            // sass({
            //     // output: 'bundle.css',
            //     processor: css => postcss([autoprefixer])
            //         .process(css)
            //         .then(result => result.css)
            // })
            sass({
                output: 'build/styles.bundle.css',
                processor: css => postcss([autoprefixer])
                    .process(css)
                    .then(result => result.css)
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

import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
// import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace'

const formats = ['iife', 'esm']

export default {
    input: 'src/main.js',
    output: formats.map(format => {
        return {
            file: `build/main.bundle.${format}.js`,
            format: format
        }
    }),
    plugins: [
        resolve({
            module: true,
            browser: true
        }),
        commonjs(),
        // babel(),
        replace({
            'process.env.NODE_ENV': JSON.stringify('production')
        })
    ]
}

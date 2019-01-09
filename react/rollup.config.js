import nodeResolve from 'rollup-plugin-node-resolve';
import buble from 'rollup-plugin-buble';
import sass from 'rollup-plugin-sass';
import { uglify } from 'rollup-plugin-uglify';
import es3 from 'rollup-plugin-es3';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import svgi from "rollup-plugin-svgi";
import SVGO from "svgo";

export default {
	input: 'index.js',
	output: {
		file: 'dist/bundle.js',
		format: 'iife'
	},
	external: [],
	plugins: [
		sass({
			output: 'dist/bundle.css'
		}),
		svgi({
			options: {
				jsx: "react",
				clean: rawSVG => (
					new SVGO({
						plugins: [
							{removeDoctype: true},
							{removeXMLNS: true},
							{removeComments: true},
							{removeViewBox: false},
						]
					}).optimize(rawSVG).then(optzSvg => optzSvg.data)
				)
			}
		}),
		buble({
			objectAssign: 'Object.assign'
		}),
		replace({
			'process.env.NODE_ENV': JSON.stringify('production')
		}),
		commonjs(),
		nodeResolve({
			modules: true,
			jsnext: true
		}),
		uglify({
			output: { comments: false },
			mangle: {
				toplevel: true,
				properties: { regex: /^_/ }
			},
		}),
		es3()
	]
};
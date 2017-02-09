"use strict";

/*;
	@module-license:
		The MIT License (MIT)
		@mit-license

		Copyright (@c) 2017 Richeve Siodina Bebedor
		@email: richeve.bebedor@gmail.com

		Permission is hereby granted, free of charge, to any person obtaining a copy
		of this software and associated documentation files (the "Software"), to deal
		in the Software without restriction, including without limitation the rights
		to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		copies of the Software, and to permit persons to whom the Software is
		furnished to do so, subject to the following conditions:

		The above copyright notice and this permission notice shall be included in all
		copies or substantial portions of the Software.

		THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		SOFTWARE.
	@end-module-license

	@module-configuration:
		{
			"package": "levy",
			"path": "levy/levy.js",
			"file": "levy.js",
			"module": "levy",
			"author": "Richeve S. Bebedor",
			"eMail": "richeve.bebedor@gmail.com",
			"repository": "https://github.com/volkovasystems/levy.git",
			"test": "levy-test.js",
			"global": true
		}
	@end-module-configuration

	@module-documentation:
		Alleviate NodeJS' memory limit.
	@end-module-documentation

	@include:
		{
			"budge": "budge",
			"child": "child_process",
			"depher": "depher",
			"falzy": "falzy",
			"gnaw": "gnaw",
			"harden": "harden",
			"numric": "numric",
			"os": "os",
			"raze": "raze",
			"truly": "truly"
		}
	@end-include
*/

const budge = require( "budge" );
const child = require( "child_process" );
const depher = require( "depher" );
const falzy = require( "falzy" );
const gnaw = require( "gnaw" );
const harden = require( "harden" );
const numric = require( "numric" );
const os = require( "os" );
const raze = require( "raze" );
const truly = require( "truly" );

const construct = function construct( command, node, size ){
	/*;
		@meta-configuration:
			{
				"command:required": "string",
				"node": "string",
				"size": "number"
			}
		@end-meta-configuration
	*/

	let parameter = raze( arguments ).filter( truly );

	node = depher( budge( parameter ), STRING, `n use ${ gnaw( "n --lts", true ) }` );

	size = depher( parameter,
		( value ) => { return numric( value ); },
		( ( memory ) => {
			let factor = 2;

			while( Math.pow( 2, ++factor ) < memory ){ }

			return Math.pow( 2, --factor );
		} )( Math.ceil( os.totalmem( ) / 1000000 / 2 ) ) );

	command = command.split( /\s+/ );
	if( command.length > 1 ){
		let main = command[ 0 ];
		command[ 0 ] = gnaw( `which ${ main }`, true );
		if( falzy( command[ 0 ] ) ){
			throw new Error( `cannot lookup bin path, ${ main }` );
		}
	}
	command = command.join( " " );

	return `${ node } --max-old-space-size=${ size } ${ command }`;
};

const levy = function levy( command, node, size ){
	/*;
		@meta-configuration:
			{
				"command:required": "string",
				"node": "string",
				"size": "number"
			}
		@end-meta-configuration
	*/

	command = construct.apply( null, raze( arguments ).filter( truly ) );

	console.log( command );

	return child.execSync( command, { "cwd": process.cwd( ), "stdio": "inherit" } );
};

harden( "construct", construct, levy );

module.exports = levy;

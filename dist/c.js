
//  Copyright © 2025, Classical Circuit Simulator (C.js)
//  Based on Q.js by Stewart Smith




const C = function(){


	//  Did we send arguments of the form
	//  ( bandwidth, timewidth )?

	if( arguments.length === 2 &&
		Array.from( arguments ).every( function( argument ){

		return C.isUsefulInteger( argument )

	})){

		return new C.Circuit( arguments[ 0 ], arguments[ 1 ])
	}


	//  Otherwise assume we are creating a circuit
	//  from a text block.

	return C.Circuit.fromText( arguments[ 0 ])
}




Object.assign( C, {

	verbosity: 0.5,
	log: function( verbosityThreshold, ...remainingArguments ){

		if( C.verbosity >= verbosityThreshold ) console.log( ...remainingArguments )
		return '(log)'
	},
	warn: function(){

		console.warn( ...arguments )
		return '(warn)'
	},
	error: function(){

		console.error( ...arguments )
		return '(error)'
	},
	extractDocumentation: function( f ){

		`
		I wanted a way to document code
		that was cleaner, more legible, and more elegant
		than the bullshit we put up with today.
		Also wanted it to print nicely in the console.
		`

		f = f.toString()

		const
		begin = f.indexOf( '`' ) + 1,
		end   = f.indexOf( '`', begin ),
		lines = f.substring( begin, end ).split( '\n' )


		function countPrefixTabs( text ){


			//  Is counting tabs "manually"
			//  actually more performant than regex?

			let count = index = 0
			while( text.charAt( index ++ ) === '\t' ) count ++
			return count
		}


		//-------------------  TO DO!
		//  we should check that there is ONLY whitespace between the function opening and the tick mark!
		//  otherwise it's not documentation.

		let
		tabs  = Number.MAX_SAFE_INTEGER

		lines.forEach( function( line ){

			if( line ){

				const lineTabs = countPrefixTabs( line )
				if( tabs > lineTabs ) tabs = lineTabs
			}
		})
		lines.forEach( function( line, i ){

			if( line.trim() === '' ) line = '\n\n'
			lines[ i ] = line.substring( tabs ).replace( / {2}$/, '\n' )
		})
		return lines.join( '' )
	},
	help: function( f ){

		if( f === undefined ) f = C
		return C.extractDocumentation( f )
	},
	constants: {},
	createConstant: function( key, value ){

		//Object.freeze( value )
		this[ key ] = value
		this.constants[ key ] = this[ key ]
		Object.freeze( this[ key ])
	},
	createConstants: function(){

		if( arguments.length % 2 !== 0 ){

			return C.error( 'C attempted to create constants with invalid (KEY, VALUE) pairs.' )
		}
		for( let i = 0; i < arguments.length; i += 2 ){

			this.createConstant( arguments[ i ], arguments[ i + 1 ])
		}
	},




	isUsefulNumber: function( n ){

		return isNaN( n ) === false &&
			( typeof n === 'number' || n instanceof Number ) &&
			n !==  Infinity &&
			n !== -Infinity
	},
	isUsefulInteger: function( n ){

		return C.isUsefulNumber( n ) && Number.isInteger( n )
	},
	loop: function(){},
	round: function( n, d ){

		if( typeof d !== 'number' ) d = 0
		const f = Math.pow( 10, d )
		return Math.round( n * f ) / f
	},
	toTitleCase: function( text ){

		text = text.replace( /_/g, ' ' )
		return text.toLowerCase().split( ' ' ).map( function( word ){

			return word.replace( word[ 0 ], word[ 0 ].toUpperCase() )

		}).join(' ')
	},
	centerText: function( text, length, filler ){

		if( length > text.length ){

			if( typeof filler !== 'string' ) filler = ' '

			const
			padLengthLeft  = Math.floor(( length - text.length ) / 2 ),
			padLengthRight = length - text.length - padLengthLeft

			return text
				.padStart( padLengthLeft + text.length, filler )
				.padEnd( length, filler )
		}
		else return text
	},





	namesIndex: 0,
	shuffledNames: [],
	shuffleNames$: function(){

		let m = []
		for( let c = 0; c < C.COLORS.length; c ++ ){

			for( let a = 0; a < C.DEVICES.length; a ++ ){

				m.push([ c, a, Math.random() ])
			}
		}
		C.shuffledNames = m.sort( function( a, b ){

			return a[ 2 ] - b[ 2 ]
		})
	},
	getRandomName$: function(){

		if( C.shuffledNames.length === 0 ) C.shuffleNames$()

		const
		pair = C.shuffledNames[ C.namesIndex ],
		name = C.COLORS[ pair[ 0 ]] +' '+ C.DEVICES[ pair[ 1 ]]

		C.namesIndex = ( C.namesIndex + 1 ) % C.shuffledNames.length
		return name
	},
	hueToColorName: function( hue ){

		hue = hue % 360
		hue = Math.floor( hue / 10 )
		return C.COLORS[ hue ]
	},
	colorIndexToHue: function( i ){

		return i * 10
	}




})




C.createConstants(

	'REVISION', 1,
	'EPSILON', Number.EPSILON * 6,

	'DEVICES', [
		'Amplifier',
		'Accumulator',
		'ALU',
		'Adder',
		'Buffer',
		'Comparator',
		'Counter',
		'Decoder',
		'Demux',
		'Driver',
		'Encoder',
		'Flip-flop',
		'Gate',
		'Inverter',
		'Latch',
		'LED',
		'Multiplexer',
		'NAND',
		'NOR',
		'Register',
		'Relay',
		'Resistor',
		'Selector',
		'Sensor',
		'Shifter',
		'Switch',
		'Timer',
		'Transistor',
		'XOR'
	],
	'COLORS', [

		'Red',         //    0  RED
		'Scarlet',     //   10
		'Tawny',       //   20
		'Carrot',      //   30
		'Pumpkin',     //   40
		'Mustard',     //   50
		'Lemon',       //   60  Yellow
		'Lime',        //   70
		'Spring bud',  //   80
		'Spring grass',//   90
		'Pear',        //  100
		'Kelly',       //  110
		'Green',       //  120  GREEN
		'Malachite',   //  130
		'Sea green',   //  140
		'Sea foam',    //  150
		'Aquamarine',  //  160
		'Turquoise',   //  170
		'Cyan',        //  180  Cyan
		'Pacific blue',//  190
		'Baby blue',   //  200
		'Ocean blue',  //  210
		'Sapphire',    //  220
		'Azure',       //  230
		'Blue',        //  240  BLUE
		'Cobalt',      //  250
		'Indigo',      //  260
		'Violet',      //  270
		'Lavender',    //  280
		'Purple',      //  290
		'Magenta',     //  300  Magenta
		'Hot pink',    //  310
		'Fuschia',     //  320
		'Ruby',        //  330
		'Crimson',     //  340
		'Carmine'      //  350
	]
)




console.log( `


  CCCCCC
CC      CC
CC
CC
CC
CC      CC
  CCCCCC    ${C.REVISION}



https://classical-circuit-simulator.js



` )



//  Copyright © 2025, Classical Circuit Simulator (C.js)




C.Bit = function( value, symbol, name ){


	//  Normalize input to 0 or 1
	if( typeof value === 'boolean' ){
		this.value = value ? 1 : 0
	}
	else if( typeof value === 'number' ){
		this.value = value ? 1 : 0  // Any non-zero number becomes 1
	}
	else {
		this.value = 0  // Default to 0
	}

	this.index = C.Bit.index ++


	//  Used for notation

	if( typeof symbol === 'string' ) this.symbol = symbol
	if( typeof name  === 'string' ) this.name  = name
	if( this.symbol === undefined || this.name === undefined ){

		const found = Object.values( C.Bit.constants ).find( function( bit ){

			return value === bit.value
		})
		if( found === undefined ){

			this.symbol = '?'
			this.name  = 'Unnamed'
		}
		else {

			if( this.symbol === undefined ) this.symbol = found.symbol
			if( this.name  === undefined ) this.name  = found.name
		}
	}
}




Object.assign( C.Bit, {

	index: 0,
	help: function(){ return C.help( this )},
	constants: {},
	createConstant:  C.createConstant,
	createConstants: C.createConstants,



	findBy: function( key, value ){

		return (

			Object
			.values( C.Bit.constants )
			.find( function( item ){

				if( typeof value === 'string' &&
					typeof item[ key ] === 'string' ){

					return value.toLowerCase() === item[ key ].toLowerCase()
				}
				return value === item[ key ]
			})
		)
	},
	findBySymbol: function( symbol ){

		return C.Bit.findBy( 'symbol', symbol )
	},
	findByName: function( name ){

		return C.Bit.findBy( 'name', name )
	},
	findByValue: function( value ){

		return Object.values( C.Bit.constants ).find( function( bit ){

			return bit.value === value
		})
	},
	areEqual: function( bit0, bit1 ){

		return bit0.value === bit1.value
	},
	toText: function( bit ){

		return bit.value.toString()
	},
	toBinary: function( bit ){

		return bit.value
	}

})




C.Bit.createConstants(

	//  Binary states

	'ZERO', new C.Bit( 0, '0', 'Zero' ),
	'ONE',  new C.Bit( 1, '1', 'One' ),
	'LOW',  new C.Bit( 0, 'L', 'Low' ),
	'HIGH', new C.Bit( 1, 'H', 'High' ),
	'FALSE', new C.Bit( 0, 'F', 'False' ),
	'TRUE',  new C.Bit( 1, 'T', 'True' )
)




Object.assign( C.Bit.prototype, {

	copy$: function( bit ){

		if( bit instanceof C.Bit !== true )
			return C.error( `C.Bit attempted to copy something that was not a bit in this bit #${this.index}.`, this )

		this.value = bit.value
		return this
	},
	clone: function(){

		return new C.Bit( this.value )
	},
	isEqualTo: function( otherBit ){

		return C.Bit.areEqual( this, otherBit )  // Returns a Boolean
	},
	applyGate: function( gate, ...args ){

		return C.Bit.applyGate( this, gate, ...args )
	},
	toText: function(){

		return C.Bit.toText( this )  // Returns a String
	},
	toBinary: function(){

		return C.Bit.toBinary( this )  // Returns 0 or 1
	},
	applyGate$: function( gate ){

		return this.copy$( C.Bit.applyGate( this, gate ))
	},
	NOT: function(){

		return new C.Bit( this.value === 0 ? 1 : 0 )
	},
	NOT$: function(){

		this.value = this.value === 0 ? 1 : 0
		return this
	}
})



//  Copyright © 2025, Classical Circuit Simulator (C.js)




C.Gate = function (params) {

	Object.assign(this, params)
	this.index = C.Gate.index++

	if (typeof this.symbol !== 'string') this.symbol = '?'


	//  We use symbols as unique identifiers
	//  among gate CONSTANTS
	//  so if you use the same symbol for a non-constant
	//  that's not a deal breaker
	//  but it is good to know.

	const
		scope = this,
		foundConstant = Object
			.values(C.Gate.constants)
			.find(function (gate) {

				return gate.symbol === scope.symbol
			})

	if (foundConstant) {

		C.warn(`C.Gate is creating a new instance, #${this.index}, that uses the same symbol as a pre-existing Gate constant:`, foundConstant)
	}

	if (typeof this.name !== 'string') this.name = 'Unknown'
	if (typeof this.nameCss !== 'string') this.nameCss = 'unknown'
	if (typeof this.inputCount !== 'number') this.inputCount = 1
	if (typeof this.wireSpan !== 'number') this.wireSpan = this.inputCount


	//  Every gate must have an applyToInputs method.
	//  If it doesn't exist, we'll create a default one.

	if (typeof this.applyToInputs !== 'function') {

		this.applyToInputs = function (...inputs) {
			return inputs[0] !== undefined ? inputs[0] : new C.Bit(0)
		}
	}
}




Object.assign(C.Gate, {

	index: 0,
	constants: {},
	createConstant: C.createConstant,
	createConstants: C.createConstants,
	findBy: function (key, value) {

		return (

			Object
				.values(C.Gate.constants)
				.find(function (item) {

					if (typeof value === 'string' &&
						typeof item[key] === 'string') {

						return value.toLowerCase() === item[key].toLowerCase()
					}
					return value === item[key]
				})
		)
	},
	findBySymbol: function (symbol) {

		return C.Gate.findBy('symbol', symbol)
	},
	findByName: function (name) {

		return C.Gate.findBy('name', name)
	}
})




Object.assign(C.Gate.prototype, {

	clone: function (params) {

		return new C.Gate(Object.assign({}, this, params))
	},
	set$: function (key, value) {

		this[key] = value
		return this
	},
	setSymbol$: function (value) {

		return this.set$('symbol', value)
	}
})




C.Gate.createConstants(


	//  Single input gates

	'IDENTITY', new C.Gate({

		symbol: 'I',
		name: 'Identity',
		nameCss: 'identity',
		inputCount: 1,
		applyToInputs: function (a) {
			return new C.Bit(a.value)
		}
	}),
	'BUFFER', new C.Gate({

		symbol: 'BUF',
		name: 'Buffer',
		nameCss: 'buffer',
		inputCount: 1,
		applyToInputs: function (a) {
			return new C.Bit(a.value)
		}
	}),
	'NOT', new C.Gate({

		symbol: 'NOT',
		name: 'NOT',
		nameCss: 'not',
		inputCount: 1,
		applyToInputs: function (a) {
			return new C.Bit(a.value === 0 ? 1 : 0)
		}
	}),


	//  Two input gates

	'AND', new C.Gate({

		symbol: 'AND',
		name: 'AND',
		nameCss: 'and',
		inputCount: 2,
		wireSpan: 2,
		applyToInputs: function (a, b) {
			return new C.Bit((a.value && b.value) ? 1 : 0)
		}
	}),
	'OR', new C.Gate({

		symbol: 'OR',
		name: 'OR',
		nameCss: 'or',
		inputCount: 2,
		wireSpan: 2,
		applyToInputs: function (a, b) {
			return new C.Bit((a.value || b.value) ? 1 : 0)
		}
	}),
	'NAND', new C.Gate({

		symbol: 'NAND',
		name: 'NAND',
		nameCss: 'nand',
		inputCount: 2,
		wireSpan: 2,
		applyToInputs: function (a, b) {
			return new C.Bit((a.value && b.value) ? 0 : 1)
		}
	}),
	'NOR', new C.Gate({

		symbol: 'NOR',
		name: 'NOR',
		nameCss: 'nor',
		inputCount: 2,
		wireSpan: 2,
		applyToInputs: function (a, b) {
			return new C.Bit((a.value || b.value) ? 0 : 1)
		}
	}),
	'XOR', new C.Gate({

		symbol: 'XOR',
		name: 'XOR',
		nameCss: 'xor',
		inputCount: 2,
		wireSpan: 2,
		applyToInputs: function (a, b) {
			return new C.Bit((a.value !== b.value) ? 1 : 0)
		}
	}),
	'XNOR', new C.Gate({

		symbol: 'XNOR',
		name: 'XNOR',
		nameCss: 'xnor',
		inputCount: 2,
		wireSpan: 2,
		applyToInputs: function (a, b) {
			return new C.Bit((a.value === b.value) ? 1 : 0)
		}
	}),


	//  Three input gates

	'AND3', new C.Gate({

		symbol: 'AND3',
		name: 'AND (3-input)',
		nameCss: 'and3',
		inputCount: 3,
		wireSpan: 3,
		applyToInputs: function (a, b, c) {
			return new C.Bit((a.value && b.value && c.value) ? 1 : 0)
		}
	}),
	'OR3', new C.Gate({

		symbol: 'OR3',
		name: 'OR (3-input)',
		nameCss: 'or3',
		inputCount: 3,
		wireSpan: 3,
		applyToInputs: function (a, b, c) {
			return new C.Bit((a.value || b.value || c.value) ? 1 : 0)
		}
	}),


	//  Special gates

	'PROBE', new C.Gate({

		symbol: 'P',
		name: 'Probe',
		nameCss: 'probe',
		inputCount: 1,
		applyToInputs: function (a) {
			// Just passes through the value but can be monitored
			return new C.Bit(a.value)
		}
	})
)



//  Copyright © 2025, Classical Circuit Simulator (C.js)
//  Based on Q.js by Stewart Smith




C.History = function( instance ){

	this.instance = instance
	this.entries = [[{

		redo:  {},
		undo: [{}]
	}]]
	this.index = 0
	this.isRecording = true
}




Object.assign( C.History.prototype, {

	assess: function(){

		const instance = this.instance
		if( this.index > 0 ){

			window.dispatchEvent( new CustomEvent(

				'C.History undo is capable', { detail: { instance }}
			))
		}
		else {

			window.dispatchEvent( new CustomEvent(

				'C.History undo is depleted', { detail: { instance }}
			))
		}
		if( this.index + 1 < this.entries.length ){

			window.dispatchEvent( new CustomEvent(

				'C.History redo is capable', { detail: { instance }}
			))
		}
		else {

			window.dispatchEvent( new CustomEvent(

				'C.History redo is depleted', { detail: { instance }}
			))
		}
		return this
	},
	createEntry$: function(){

		this.entries.splice( this.index + 1 )
		this.entries.push([])
		this.index = this.entries.length - 1
	},
	record$: function( entry ){


		//  Are we recording this history?
		//  Usually, yes.
		//  But if our history state is "playback"
		//  then we will NOT record this.

		if( this.isRecording ){

			this.entries[ this.index ].push( entry )
			this.index = this.entries.length - 1
			this.assess()
		}
		return this
	},
	step$: function( direction ){


		//  If we are stepping backward (undo)
		//  we cannot go back further than index === 0
		//  which we would happen if index is already 0
		//  before we subtract 1.
		//  Similarly, if stepping forward (redo)
		//  we cannot go further than index === entries.length - 1
		//  which would happen if the index is already entries.length
		//  before we add 1.

		if(
			( direction < 0 && this.index < 1 ) ||
			( direction > 0 && this.index > this.entries.length - 2 )
		) return false


		//  Before we step backward (undo) or forward (redo)
		//  we need to turn OFF history recording.

		this.isRecording = false

		const
		instance = this.instance,
		command = direction < 0 ? 'undo' : 'redo'


		//  If we are stepping forward (redo)
		//  then we need to advance the history index
		//  BEFORE we execute.

		if( direction > 0 ) this.index ++


		//  Take this history entry, which itself is an Array.
		//  It may contain several tasks.
		//  Put my thing down, flip and reverse it.
		//  .ti esrever dna pilf ,nwod gniht ym tuP

		const entry = direction > 0 ?
			Array.from( this.entries[ this.index ]) :
			Array.from( this.entries[ this.index ]).reverse()

		entry
		.reduce( function( tasks, subentry, s ){

			return tasks.concat( subentry[ command ])

		}, [] )
		.forEach( function( task, i ){

			if( typeof task.func === 'function' ){

				task.func.apply( instance, task.args )
			}
		})


		//  If we are stepping backward (undo)
		//  then we decrement the history index
		//  AFTER the execution above.

		if( direction < 0 ) this.index --


		//  It's now safe to turn recording back on.

		this.isRecording = true


		//  Emit an event so the GUI or anyone else listening
		//  can know if we have available undo or redo commands
		//  based on where or index is.

		this.assess()
		return true
	},
	undo$: function(){ return this.step$( -1 )},
	redo$: function(){ return this.step$(  1 )},
	report: function(){

		const argsParse = function( output, entry, i ){

			if( i > 0 ) output += ',  '
			return output + ( typeof entry === 'object' && entry.name ? entry.name : entry )
		}
		return this.entries.reduce( function( output, entry, i ){

			output += '\n\n'+ i + ' ════════════════════════════════════════'+
			entry.reduce( function( output, entry, i ){

				output += '\n\n    '+ i +' ────────────────────────────────────────\n'
				if( entry.redo ){

					output += '\n        ⟳ Redo   ── '+ entry.redo.name +'  '
					if( entry.redo.args ) output += entry.redo.args.reduce( argsParse, '' )
				}
				output += entry.undo.reduce( function( output, entry, i ){

					output += '\n        ⟲ Undo '+ i +' ── '+ entry.name +'  '
					if( entry.args ) output += entry.args.reduce( argsParse, '' )
					return output

				}, '' )

				return output

			}, '' )
			return output

		}, 'History entry cursor: '+ this.index )
	}
})



//  Copyright © 2025, Classical Circuit Simulator (C.js)
//  Based on Q.js by Stewart Smith




C.Circuit = function (bandwidth, timewidth) {


	//  What number Circuit is this
	//  that we're attempting to make here?

	this.index = C.Circuit.index++


	//  How many bits (wires) shall we use?

	if (!C.isUsefulInteger(bandwidth)) bandwidth = 3
	this.bandwidth = bandwidth


	//  How many operations can we perform on each bit?
	//  Each operation counts as one moment; one clock tick.

	if (!C.isUsefulInteger(timewidth)) timewidth = 5
	this.timewidth = timewidth


	//  We'll start with ZERO bits as inputs
	//  but we can of course modify this after initialization.

	this.bits = new Array(bandwidth).fill(C.Bit.ZERO)


	//  What operations will we perform on our bits?

	this.operations = []


	//  Does our circuit need evaluation?
	//  Certainly, yes!
	// (And will again each time it is modified.)

	this.needsEvaluation = true


	//  When our circuit is evaluated
	//  we store those results in this array.

	this.results = []


	//  Undo / Redo history.

	this.history = new C.History(this)
}




Object.assign(C.Circuit, {

	index: 0,
	help: function () { return C.help(this) },
	constants: {},
	createConstant: C.createConstant,
	createConstants: C.createConstants,


	fromText: function (text) {


		//  This is a quick way to enable `fromText()`
		//  to return a default new C.Circuit().

		if (text === undefined) return new C.Circuit()


		//  Is this a String Template -- as opposed to a regular String?
		//  If so, let's convert it to a regular String.
		//  Yes, this maintains the line breaks.

		if (text.raw !== undefined) text = '' + text.raw
		return C.Circuit.fromTableTransposed(

			text
				.trim()
				.split(/\r?\n/)
				.filter(function (item) { return item.length })
				.map(function (item, r) {

					return item
						.trim()
						.split(/[-+\s+=+]/)
						.filter(function (item) { return item.length })
						.map(function (item, m) {

							const matches = item.match(/(^\w+)(\.(\w+))*(#(\d+))*/)
							return {

								gateSymbol: matches[1],
								operationMomentId: matches[3],
								mappingIndex: +matches[5]
							}
						})
				})
		)
	},




	fromTableTransposed: function (table) {

		const
			bandwidth = table.length,
			timewidth = table.reduce(function (max, moments) {

				return Math.max(max, moments.length)

			}, 0),
			circuit = new C.Circuit(bandwidth, timewidth)

		circuit.bandwidth = bandwidth
		circuit.timewidth = timewidth
		for (let r = 0; r < bandwidth; r++) {

			const registerIndex = r + 1
			for (let m = 0; m < timewidth; m++) {

				const
					momentIndex = m + 1,
					operation = table[r][m]

				if (operation.gateSymbol !== 'I') {

					const
						gate = C.Gate.findBySymbol(operation.gateSymbol),
						registerIndices = []

					if (C.isUsefulInteger(operation.mappingIndex)) {

						registerIndices[operation.mappingIndex] = registerIndex
					}
					else registerIndices[0] = registerIndex
					circuit.operations.push({

						gate,
						momentIndex,
						registerIndices,
						operationMomentId: operation.operationMomentId
					})
				}
			}
		}
		circuit.sort$()
		return circuit
	},




	evaluate: function (circuit) {


		window.dispatchEvent(new CustomEvent(

			'C.Circuit.evaluate began', {

			detail: { circuit }
		}
		))


		//  Our circuit's operations must be in the correct order
		//  before we attempt to step through them!

		circuit.sort$()


		//  Create initial state array with input bit values
		//  Also create intermediate wire storage (e.g., wire 1.5, 2.5, etc.)

		const state = {}

		// Initialize main wires
		circuit.bits.forEach(function (bit, index) {
			state[index + 1] = bit.value
		})


		//  Evaluate each moment in the circuit

		const operationsTotal = circuit.operations.length
		let operationsCompleted = 0

		circuit.operations.forEach(function (operation, i) {

			const gate = operation.gate

			// Handle both old and new operation formats
			let inputWires, outputWire

			if (operation.inputWires && operation.outputWire) {
				// New multi-wire format
				inputWires = operation.inputWires
				outputWire = operation.outputWire
			} else {
				// Old format - fallback to registerIndices
				inputWires = operation.registerIndices.slice(0, gate.inputCount)
				outputWire = operation.registerIndices[operation.registerIndices.length - 1]
			}

			//  Get input values for this gate from specified wires
			const inputs = inputWires.map(function (wireIndex) {
				const value = state[wireIndex] !== undefined ? state[wireIndex] : 0
				return new C.Bit(value)
			}).filter(function (bit) {
				return bit !== undefined && bit !== null
			})

			// Skip if we don't have enough inputs
			if (inputs.length < gate.inputCount) {
				console.warn('Gate', gate.symbol, 'needs', gate.inputCount, 'inputs but only has', inputs.length)
				return
			}

			//  Apply gate operation
			const output = gate.applyToInputs(...inputs)

			//  Update the state at the output wire position
			//  (This may be an intermediate wire like 1.5)
			state[outputWire] = output.value

			// Capture state for this moment
			if (!circuit.trace) circuit.trace = []
			// Ensure trace has entries up to this moment
			for (let m = 0; m <= operation.momentIndex; m++) {
				if (!circuit.trace[m]) {
					circuit.trace[m] = Object.assign({}, state)
				}
			}
			// Update current moment trace
			circuit.trace[operation.momentIndex] = Object.assign({}, state)


			operationsCompleted++
			const progress = operationsCompleted / operationsTotal

			window.dispatchEvent(new CustomEvent('C.Circuit.evaluate progressed', {
				detail: {

					circuit,
					progress,
					operationsCompleted,
					operationsTotal,
					momentIndex: operation.momentIndex,
					inputWires: inputWires,
					outputWire: outputWire,
					gate: operation.gate.name,
					state: Object.assign({}, state)

				}
			}))

		})


		//  Store results for main wires only (not intermediate wires)

		circuit.results = circuit.bits.map(function (bit, index) {
			const wireIndex = index + 1
			return new C.Bit(state[wireIndex] !== undefined ? state[wireIndex] : 0)
		})

		// Also store intermediate wire values for visualization
		circuit.intermediateWires = state

		// Ensure trace is fully populated
		if (!circuit.trace) circuit.trace = []
		if (!circuit.trace[0]) {
			const initialState = {}
			circuit.bits.forEach((bit, i) => initialState[i + 1] = bit.value)
			circuit.trace[0] = initialState
		}
		for (let i = 1; i <= circuit.timewidth; i++) {
			if (!circuit.trace[i]) {
				circuit.trace[i] = Object.assign({}, circuit.trace[i - 1])
			}
		}


		circuit.needsEvaluation = false


		window.dispatchEvent(new CustomEvent('C.Circuit.evaluate completed', {
			detail: {

				circuit,
				results: circuit.results,
				intermediateWires: circuit.intermediateWires,
				trace: circuit.trace

			}
		}))


		return circuit.results
	}
})




Object.assign(C.Circuit.prototype, {

	clone: function () {

		const
			original = this,
			clone = new C.Circuit(original.bandwidth, original.timewidth)

		clone.bits = original.bits.slice()
		clone.results = original.results.slice()
		clone.operations = original.operations.slice()
		clone.needsEvaluation = original.needsEvaluation

		return clone
	},
	evaluate$: function () {

		C.Circuit.evaluate(this)
		return this
	},
	report$: function () {

		if (this.needsEvaluation) this.evaluate$()

		const
			circuit = this

		let text = this.results.reduce(function (text, bit, i) {

			return text + '\n'
				+ 'Bit ' + (i + 1) + ': '
				+ bit.value
				+ ' (' + (bit.value === 1 ? 'HIGH' : 'LOW') + ')'

		}, '')

		// Add intermediate wires to report
		if (this.intermediateWires) {
			Object.keys(this.intermediateWires).sort().forEach(function (key) {
				const wireIndex = parseFloat(key)
				// Only show fractional wires (intermediate ones)
				if (wireIndex % 1 !== 0) {
					const value = circuit.intermediateWires[key]
					text += '\n' + 'Wire ' + wireIndex + ': ' + value + ' (' + (value === 1 ? 'HIGH' : 'LOW') + ')'
				}
			})
		}

		return text + '\n'
	},




	////////////////
	//            //
	//   Output   //
	//            //
	////////////////


	//  This is absolutely required by toTable.

	sort$: function () {


		//  Sort this circuit's operations
		//  primarily by momentIndex,
		//  then by the first registerIndex.

		this.operations.sort(function (a, b) {

			if (a.momentIndex === b.momentIndex) {

				return Math.min(...a.registerIndices) - Math.min(...b.registerIndices)
			}
			else {

				return a.momentIndex - b.momentIndex
			}
		})
		return this
	},





	///////////////////
	//               //
	//   Exporters   //
	//               //
	///////////////////


	toTable: function () {

		const
			table = new Array(this.timewidth),
			circuit = this

		table.timewidth = this.timewidth
		table.bandwidth = this.bandwidth


		//  First, let's establish a "blank" table
		//  that contains an identity operation
		//  for each register during each moment.

		table.fill(0).forEach(function (element, index, array) {

			const operations = new Array(circuit.bandwidth)
			operations.fill(0).forEach(function (element, index, array) {

				array[index] = {

					symbol: 'I',
					symbolDisplay: 'I',
					name: 'Identity',
					nameCss: 'identity',
					gateInputIndex: 0
				}
			})
			array[index] = operations
		})


		//  Now let's populate that table
		//  with this circuit's non-identity operations.

		this.operations.forEach(function (operation) {

			const
				m = operation.momentIndex - 1,
				r = operation.registerIndices[0] - 1

			table[m][r] = {

				symbol: operation.gate.symbol,
				symbolDisplay: operation.gate.symbol,
				name: operation.gate.name,
				nameCss: operation.gate.nameCss,
				gateInputIndex: 0
			}
		})

		return table
	},
	toText: function () {

		const
			circuit = this,
			table = this.toTable()

		return table.reduce(function (text, moment, m) {

			const line = moment.reduce(function (line, operation, r) {

				return line + operation.symbol.padEnd(6, ' ')

			}, '')
			return text + '\n' + line

		}, '')
	},
	toDiagram: function () {

		const
			circuit = this,
			table = this.toTable()

		let output = '\n'

		for (let r = 0; r < this.bandwidth; r++) {

			output += 'Bit ' + (r + 1) + ' ──'

			for (let m = 0; m < this.timewidth; m++) {

				const operation = table[m][r]
				output += '─' + operation.symbol.padEnd(4, '─') + '─'
			}

			output += '\n'
		}

		return output
	},




	/////////////////
	//             //
	//   Setters   //
	//             //
	/////////////////


	set$: function (gateSymbol, momentIndex, ...registerIndices) {

		const
			circuit = this,
			gate = typeof gateSymbol === 'string' ? C.Gate.findBySymbol(gateSymbol) : gateSymbol

		if (gate === undefined) {

			return C.error(`C.Circuit could not find a gate with the symbol "${gateSymbol}" to set on circuit #${this.index}.`)
		}

		//  Do we already have a record of an operation
		//  at this moment and register?

		const operationIndex = this.operations.findIndex(function (operation) {

			return (

				operation.momentIndex === momentIndex &&
				operation.registerIndices[0] === registerIndices[0]
			)
		})

		if (operationIndex >= 0) {


			//  If so, we need to clear it first
			//  and record this in our history.

			const priorOperation = this.operations[operationIndex]

			this.operations.splice(operationIndex, 1)
			this.history.createEntry$()
			this.history.record$({

				redo: {

					name: 'set$',
					func: circuit.set$,
					args: [gate.symbol, momentIndex].concat(registerIndices)
				},
				undo: [{

					name: 'clear$',
					func: circuit.clear$,
					args: [momentIndex].concat(registerIndices)
				}, {

					name: 'set$',
					func: circuit.set$,
					args: [priorOperation.gate.symbol, momentIndex].concat(priorOperation.registerIndices)
				}]
			})
		}
		else {


			//  Otherwise we're free to just add it.

			this.history.createEntry$()
			this.history.record$({

				redo: {

					name: 'set$',
					func: circuit.set$,
					args: [gate.symbol, momentIndex].concat(registerIndices)
				},
				undo: [{

					name: 'clear$',
					func: circuit.clear$,
					args: [momentIndex].concat(registerIndices)
				}]
			})
		}


		//  Actually add the operation now.
		//  For multi-wire gates, we need to track input and output wires separately

		// Use ALL registerIndices as input wires (not just inputCount)
		const inputWires = registerIndices.slice()
		let outputWire

		// Calculate output wire position
		if (gate.wireSpan > 1) {

			// For multi-wire gates, output to intermediate wire
			// Example: AND gate on wires 1,2 outputs to wire 1.5
			const minWire = Math.min(...inputWires)
			const maxWire = Math.max(...inputWires)
			const rawOutput = minWire + (maxWire - minWire) / 2

			// Round to nearest 0.5 to avoid quarter wires (e.g. 2.25)
			// 1.5 + 3 -> 2.25 -> rounds to 2.5
			outputWire = Math.round(rawOutput * 2) / 2

		} else {

			// Single wire gate outputs to same wire
			outputWire = inputWires[0]
		}

		this.operations.push({

			gate,
			momentIndex,
			registerIndices,
			inputWires,
			outputWire
		})
		this.needsEvaluation = true
		this.sort$()

		window.dispatchEvent(new CustomEvent('C.Circuit.set$', {
			detail: {

				circuit,
				momentIndex,
				registerIndices
			}
		}))

		return this
	},
	clear$: function (momentIndex, ...registerIndices) {

		const
			circuit = this,
			operationIndex = this.operations.findIndex(function (operation) {

				return (

					operation.momentIndex === momentIndex &&
					operation.registerIndices[0] === registerIndices[0]
				)
			})

		if (operationIndex >= 0) {

			this.operations.splice(operationIndex, 1)
			this.needsEvaluation = true

			window.dispatchEvent(new CustomEvent('C.Circuit.clear$', {
				detail: {

					circuit,
					momentIndex,
					registerIndices
				}
			}))
		}

		return this
	},
	get: function (momentIndex, registerIndex) {

		return this.operations.find(function (operation) {

			return (

				operation.momentIndex === momentIndex &&
				operation.registerIndices.includes(registerIndex)
			)
		})
	}
})



//  Copyright © 2025, Classical Circuit Simulator (C.js)
//  Animated Beam System for visualizing data flow




C.AnimatedBeam = function (params) {

    // Unique identifier for this beam instance
    this.id = 'beam-' + C.AnimatedBeam.index++

    // Source and target elements
    this.fromElement = params.fromElement
    this.toElement = params.toElement
    this.containerElement = params.containerElement || document.body

    // Visual properties
    this.color = params.color || 'var(--C-color-green)'
    this.duration = params.duration || 1000  // milliseconds
    this.strokeWidth = params.strokeWidth || 2
    this.value = params.value !== undefined ? params.value : 1  // 0 or 1

    // Animation state
    this.isAnimating = false
    this.svg = null
    this.path = null
    this.animationElement = null

    // Create the SVG elements
    this.create()
}




Object.assign(C.AnimatedBeam, {

    index: 0,
    activeBeams: [],

    // Color mapping for bit values
    getColorForValue: function (value) {
        return value === 1 ? 'var(--C-color-green)' : 'var(--C-color-titanium)'
    },

    // Clear all active beams
    clearAll: function () {
        C.AnimatedBeam.activeBeams.forEach(function (beam) {
            beam.destroy()
        })
        C.AnimatedBeam.activeBeams = []
    },

    // Create beam between two elements
    createBeam: function (fromEl, toEl, containerEl, value) {
        const beam = new C.AnimatedBeam({
            fromElement: fromEl,
            toElement: toEl,
            containerElement: containerEl,
            value: value,
            color: C.AnimatedBeam.getColorForValue(value)
        })
        C.AnimatedBeam.activeBeams.push(beam)
        return beam
    }
})




Object.assign(C.AnimatedBeam.prototype, {

    create: function () {

        // Get positions of from and to elements
        const fromRect = this.fromElement.getBoundingClientRect()
        const toRect = this.toElement.getBoundingClientRect()
        const containerRect = this.containerElement.getBoundingClientRect()

        // Calculate center points
        const fromX = fromRect.left + fromRect.width / 2 - containerRect.left
        const fromY = fromRect.top + fromRect.height / 2 - containerRect.top
        const toX = toRect.left + toRect.width / 2 - containerRect.left
        const toY = toRect.top + toRect.height / 2 - containerRect.top

        // Create SVG element
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        this.svg.setAttribute('class', 'C-animated-beam')
        this.svg.setAttribute('id', this.id)
        this.svg.style.position = 'absolute'
        this.svg.style.top = '0'
        this.svg.style.left = '0'
        this.svg.style.width = '100%'
        this.svg.style.height = '100%'
        this.svg.style.pointerEvents = 'none'
        this.svg.style.zIndex = '5'

        // Create defs for gradient
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')
        const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient')
        gradient.setAttribute('id', this.id + '-gradient')
        gradient.setAttribute('gradientUnits', 'userSpaceOnUse')

        // Create gradient stops
        const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop')
        stop1.setAttribute('offset', '0%')
        stop1.setAttribute('stop-color', this.color)
        stop1.setAttribute('stop-opacity', '0')

        const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop')
        stop2.setAttribute('offset', '50%')
        stop2.setAttribute('stop-color', this.color)
        stop2.setAttribute('stop-opacity', '1')

        const stop3 = document.createElementNS('http://www.w3.org/2000/svg', 'stop')
        stop3.setAttribute('offset', '100%')
        stop3.setAttribute('stop-color', this.color)
        stop3.setAttribute('stop-opacity', '0')

        gradient.appendChild(stop1)
        gradient.appendChild(stop2)
        gradient.appendChild(stop3)
        defs.appendChild(gradient)
        this.svg.appendChild(defs)

        // Create path
        this.path = document.createElementNS('http://www.w3.org/2000/svg', 'path')

        // Create curved path for more visual appeal
        const midX = (fromX + toX) / 2
        const midY = (fromY + toY) / 2
        const dx = toX - fromX
        const dy = toY - fromY

        // Control point for bezier curve (perpendicular offset)
        const offset = 20
        const perpX = -dy / Math.sqrt(dx * dx + dy * dy) * offset
        const perpY = dx / Math.sqrt(dx * dx + dy * dy) * offset

        const pathData = `M ${fromX},${fromY} Q ${midX + perpX},${midY + perpY} ${toX},${toY}`

        this.path.setAttribute('d', pathData)
        this.path.setAttribute('fill', 'none')
        this.path.setAttribute('stroke', `url(#${this.id}-gradient)`)
        this.path.setAttribute('stroke-width', this.strokeWidth)
        this.path.setAttribute('stroke-linecap', 'round')

        this.svg.appendChild(this.path)
        this.containerElement.appendChild(this.svg)

        return this
    },

    animate: function () {

        if (this.isAnimating) return this

        this.isAnimating = true

        const scope = this
        const gradient = this.svg.querySelector('linearGradient')

        if (!gradient) return this

        // Animate gradient position along the line
        let progress = 0
        const animate = function () {

            progress += 0.02  // Animation speed
            if (progress > 2) progress = 0  // Loop

            // Update gradient stops to create moving effect
            const stop1 = gradient.children[0]
            const stop2 = gradient.children[1]
            const stop3 = gradient.children[2]

            const offset1 = Math.max(0, Math.min(100, (progress - 0.5) * 50))
            const offset2 = Math.max(0, Math.min(100, progress * 50))
            const offset3 = Math.max(0, Math.min(100, (progress + 0.5) * 50))

            stop1.setAttribute('offset', offset1 + '%')
            stop2.setAttribute('offset', offset2 + '%')
            stop3.setAttribute('offset', offset3 + '%')

            if (scope.isAnimating) {
                requestAnimationFrame(animate)
            }
        }

        requestAnimationFrame(animate)

        return this
    },

    stop: function () {

        this.isAnimating = false
        return this
    },

    destroy: function () {

        this.stop()
        if (this.svg && this.svg.parentNode) {
            this.svg.parentNode.removeChild(this.svg)
        }

        // Remove from active beams list
        const index = C.AnimatedBeam.activeBeams.indexOf(this)
        if (index > -1) {
            C.AnimatedBeam.activeBeams.splice(index, 1)
        }

        return this
    }
})

//  Copyright © 2025, Classical Circuit Simulator (C.js)
//  Based on Q.js by Stewart Smith




C.Circuit.Editor = function (circuit, targetEl) {


	//  First order of business,
	//  we require a valid circuit.

	if (circuit instanceof C.Circuit !== true) circuit = new C.Circuit()
	this.circuit = circuit
	this.index = C.Circuit.Editor.index++


	//  C.Circuit.Editor is all about the DOM
	//  so we're going to get some use out of this
	//  stupid (but convenient) shorthand here.

	const createDiv = function () {

		return document.createElement('div')
	}




	//  We want to "name" our circuit editor instance
	//  but more importantly we want to give it a unique DOM ID.

	this.name = typeof circuit.name === 'string' ?
		circuit.name :
		'C Editor ' + this.index


	//  If we've been passed a target DOM element
	//  we should use that as our circuit element.

	if (typeof targetEl === 'string') targetEl = document.getElementById(targetEl)
	const circuitEl = targetEl instanceof HTMLElement ? targetEl : createDiv()
	circuitEl.classList.add('C-circuit')


	//  If the target element already has an ID
	//  then we want to use that as our domID.

	if (typeof circuitEl.getAttribute('id') === 'string') {

		this.domId = circuitEl.getAttribute('id')
	}


	//  Otherwise let's transform our name value
	//  into a usable domId.

	else {

		let domIdBase = this.name
			.replace(/^[^a-z]+|[^\w:.-]+/gi, '-'),
			domId = domIdBase,
			domIdAttempt = 1

		while (document.getElementById(domId) !== null) {

			domIdAttempt++
			domId = domIdBase + '-' + domIdAttempt
		}
		this.domId = domId
		circuitEl.setAttribute('id', this.domId)
	}




	//  We want a way to easily get to the circuit
	//  from this interface's DOM element.

	circuitEl.circuit = circuit
	this.domElement = circuitEl


	//  Create a toolbar for containing buttons.

	const toolbarEl = createDiv()
	circuitEl.appendChild(toolbarEl)
	toolbarEl.classList.add('C-circuit-toolbar')


	//  Create a toggle switch for locking the circuit.

	const lockToggle = createDiv()
	toolbarEl.appendChild(lockToggle)
	lockToggle.classList.add('C-circuit-button', 'C-circuit-toggle', 'C-circuit-toggle-lock')
	lockToggle.setAttribute('title', 'Lock / unlock')
	lockToggle.innerText = '🔓'


	//  Create an "Undo" button

	const undoButton = createDiv()
	toolbarEl.appendChild(undoButton)
	undoButton.classList.add('C-circuit-button', 'C-circuit-button-undo')
	undoButton.setAttribute('title', 'Undo')
	undoButton.setAttribute('C-disabled', 'C-disabled')
	undoButton.innerHTML = '⟲'
	window.addEventListener('C.History undo is depleted', function (event) {

		if (event.detail.instance === circuit)
			undoButton.setAttribute('C-disabled', 'C-disabled')
	})
	window.addEventListener('C.History undo is capable', function (event) {

		if (event.detail.instance === circuit)
			undoButton.removeAttribute('C-disabled')
	})


	//  Create an "Redo" button

	const redoButton = createDiv()
	toolbarEl.appendChild(redoButton)
	redoButton.classList.add('C-circuit-button', 'C-circuit-button-redo')
	redoButton.setAttribute('title', 'Redo')
	redoButton.setAttribute('C-disabled', 'C-disabled')
	redoButton.innerHTML = '⟳'
	window.addEventListener('C.History redo is depleted', function (event) {

		if (event.detail.instance === circuit)
			redoButton.setAttribute('C-disabled', 'C-disabled')
	})
	window.addEventListener('C.History redo is capable', function (event) {

		if (event.detail.instance === circuit)
			redoButton.removeAttribute('C-disabled')
	})


	//  Create "Show Signal" button (Data Flow)
	const signalButton = createDiv()
	toolbarEl.appendChild(signalButton)
	signalButton.classList.add('C-circuit-button', 'C-circuit-button-signal')
	signalButton.setAttribute('title', 'Show active current signal')
	signalButton.innerHTML = '&#8669;' // Squiggly arrow or similar
	signalButton.style.fontSize = '1.5rem'

	//  Create "Show Connectivity" button
	const connectivityButton = createDiv()
	toolbarEl.appendChild(connectivityButton)
	connectivityButton.classList.add('C-circuit-button', 'C-circuit-button-connectivity')
	connectivityButton.setAttribute('title', 'Show circuit connectivity')
	connectivityButton.innerHTML = '&#8646;' // Exchange arrow
	connectivityButton.style.fontSize = '1.5rem'


	//  Toggle logic for animation buttons
	let animationMode = 'connectivity' // Default to connectivity as per latest user preference? Or signal? User said "active current signal is also nice". Let's default to connectivity (current state).

	// Update wire animations based on trace and mode
	C.Circuit.Editor.updateWireAnimations = function (circuitEl) {
		console.log('=== updateWireAnimations called ===')
		const
			circuit = circuitEl.circuit,
			trace = circuit.trace,
			backgroundEl = circuitEl.querySelector('.C-circuit-board-background'),
			signalBtn = circuitEl.querySelector('.C-circuit-button-signal'),
			connBtn = circuitEl.querySelector('.C-circuit-button-connectivity')

		let mode = null
		if (signalBtn && signalBtn.classList.contains('C-circuit-button-active')) mode = 'signal'
		else if (connBtn && connBtn.classList.contains('C-circuit-button-active')) mode = 'connectivity'

		console.log('Animation mode:', mode)
		console.log('Circuit operations:', circuit.operations)
		console.log('Circuit timewidth:', circuit.timewidth)
		console.log('Circuit bandwidth:', circuit.bandwidth)

		if (!mode) {
			console.log('No mode active, clearing animations')
			// Clear all animations
			const wires = backgroundEl.querySelectorAll('.C-circuit-wire-animated')
			wires.forEach(el => {
				el.style.removeProperty('--wire-mask')
				el.style.removeProperty('--wire-clip')
				el.classList.remove('C-circuit-wire-animated', 'C-circuit-wire-signal')
			})
			return
		}

		// Helper to get wire element
		const getWireEl = (wireIndex) => {
			let rowEl = backgroundEl.querySelector(`div[register-index="${wireIndex}"]`)
			if (rowEl) return rowEl.querySelector('.C-circuit-register-wire')

			rowEl = backgroundEl.querySelector(`div[wire-index="${wireIndex}"]`)
			if (rowEl) return rowEl.querySelector('.C-circuit-register-wire')
			return null
		}

		const allWireIndices = new Set()
		for (let i = 1; i <= circuit.bandwidth; i++) allWireIndices.add(i)
		if (circuit.intermediateWires) {
			Object.keys(circuit.intermediateWires).forEach(k => allWireIndices.add(+k))
		}
		console.log('All wire indices:', Array.from(allWireIndices))

		if (mode === 'connectivity') {
			console.log('--- CONNECTIVITY MODE ---')
			// Build a map of which moments have operations on each wire
			const wireOperations = new Map() // wireIndex -> array of momentIndices

			circuit.operations.forEach(op => {
				console.log('Processing operation:', op)
				// Track input wires
				if (op.inputWires) {
					op.inputWires.forEach(wireIdx => {
						if (!wireOperations.has(wireIdx)) wireOperations.set(wireIdx, [])
						wireOperations.get(wireIdx).push(op.momentIndex)
						console.log(`  Input wire ${wireIdx} at moment ${op.momentIndex}`)
					})
				}
				// Track output wire
				if (op.outputWire) {
					if (!wireOperations.has(op.outputWire)) wireOperations.set(op.outputWire, [])
					wireOperations.get(op.outputWire).push(op.momentIndex)
					console.log(`  Output wire ${op.outputWire} at moment ${op.momentIndex}`)
				}
			})

			console.log('Wire operations map:', wireOperations)

			// First pass: remove all animations to reset timing
			allWireIndices.forEach(wireIndex => {
				const wireEl = getWireEl(wireIndex)
				if (wireEl) {
					wireEl.classList.remove('C-circuit-wire-animated', 'C-circuit-wire-signal')
				}
			})

			// Force a reflow to ensure the removal takes effect
			backgroundEl.offsetHeight

			// Second pass: add animations back synchronously
			allWireIndices.forEach(wireIndex => {
				const wireEl = getWireEl(wireIndex)
				if (!wireEl) {
					console.log(`Wire ${wireIndex}: element not found`)
					return
				}

				const moments = wireOperations.get(wireIndex)
				if (!moments || moments.length === 0) {
					console.log(`Wire ${wireIndex}: no operations, removing animation`)
					// No operations on this wire - no beam
					wireEl.style.removeProperty('--wire-mask')
					wireEl.style.removeProperty('--wire-clip')
					wireEl.classList.remove('C-circuit-wire-animated', 'C-circuit-wire-signal')
					return
				}

				// Find the range of moments this wire is active
				const minMoment = Math.min(...moments)
				const maxMoment = Math.max(...moments)
				console.log(`Wire ${wireIndex}: moments ${moments}, range ${minMoment}-${maxMoment}`)

				// For intermediate wires (non-integer indices), the beam should start
				// from where the wire is created (first operation), not from the input
				const isIntermediateWire = wireIndex % 1 !== 0
				const beamStartMoment = isIntermediateWire ? minMoment : 0

				console.log(`Wire ${wireIndex}: isIntermediate=${isIntermediateWire}, beamStart=${beamStartMoment}`)

				// Calculate clip-path to show beam only in the active region
				// inset(top right bottom left)
				// The beam should flow TO the gate, so we use maxMoment (not maxMoment-1)
				const startPercent = (beamStartMoment / circuit.timewidth) * 100
				const endPercent = ((maxMoment) / circuit.timewidth) * 100  // Changed from maxMoment to include the gate position
				const leftInset = startPercent
				const rightInset = 100 - endPercent

				const clipPath = `inset(0 ${rightInset}% 0 ${leftInset}%)`
				console.log(`Wire ${wireIndex}: clip-path = ${clipPath} (${startPercent}% to ${endPercent}%)`)

				wireEl.style.setProperty('--wire-clip', clipPath)
				wireEl.classList.add('C-circuit-wire-animated')
			})
		} else if (mode === 'signal') {
			console.log('--- SIGNAL MODE ---')
			// Signal mode: use trace to show beams only where signal is 1
			if (!trace) {
				console.log('No trace available - clearing signal animations')
				// Clear all signal animations since circuit hasn't been evaluated
				allWireIndices.forEach(wireIndex => {
					const wireEl = getWireEl(wireIndex)
					if (wireEl) {
						wireEl.style.removeProperty('--wire-clip')
						wireEl.classList.remove('C-circuit-wire-animated', 'C-circuit-wire-signal')
					}
				})
				return
			}
			console.log('Trace data:', trace)

			// First pass: remove all animations to reset timing
			allWireIndices.forEach(wireIndex => {
				const wireEl = getWireEl(wireIndex)
				if (wireEl) {
					// Force stop animation
					wireEl.style.animation = 'none'
					wireEl.style.removeProperty('--wire-clip')
					wireEl.classList.remove('C-circuit-wire-animated', 'C-circuit-wire-signal')
				}
			})

			// Force a reflow
			backgroundEl.offsetHeight

			// Remove the animation: none override
			allWireIndices.forEach(wireIndex => {
				const wireEl = getWireEl(wireIndex)
				if (wireEl) {
					wireEl.style.removeProperty('animation')
				}
			})

			// Second pass: add animations based on signal values
			allWireIndices.forEach(wireIndex => {
				const wireEl = getWireEl(wireIndex)
				if (!wireEl) return

				// Find segments where signal is 1
				const activeSegments = []
				const traceValues = []
				for (let m = 0; m < circuit.timewidth; m++) {
					const traceValue = trace[m] && trace[m][wireIndex]
					traceValues.push(traceValue)
					// Only show beam if signal value is explicitly 1
					if (traceValue === 1) {
						activeSegments.push(m)
					}
				}

				console.log(`Wire ${wireIndex}: trace values = [${traceValues}], active segments = [${activeSegments}]`)

				if (activeSegments.length === 0) {
					console.log(`Wire ${wireIndex}: no signal (all 0s)`)
					wireEl.style.removeProperty('--wire-clip')
					return
				}

				// Calculate clip-path for signal segments
				// For simplicity, show from first to last active segment
				const minMoment = Math.min(...activeSegments)
				const maxMoment = Math.max(...activeSegments)

				const startPercent = (minMoment / circuit.timewidth) * 100
				const endPercent = ((maxMoment + 1) / circuit.timewidth) * 100
				const leftInset = startPercent
				const rightInset = 100 - endPercent

				const clipPath = `inset(0 ${rightInset}% 0 ${leftInset}%)`
				console.log(`Wire ${wireIndex}: signal segments ${activeSegments}, clip-path = ${clipPath}`)

				wireEl.style.setProperty('--wire-clip', clipPath)
				wireEl.classList.add('C-circuit-wire-animated', 'C-circuit-wire-signal')
			})
		}
		console.log('=== updateWireAnimations complete ===')
	}

	const updateButtonStyles = () => {
		signalButton.classList.toggle('C-circuit-button-active', animationMode === 'signal')
		connectivityButton.classList.toggle('C-circuit-button-active', animationMode === 'connectivity')
		// Trigger animation update
		C.Circuit.Editor.updateWireAnimations(circuitEl)
	}

	signalButton.addEventListener('click', () => {
		animationMode = (animationMode === 'signal') ? null : 'signal'
		updateButtonStyles()
	})

	connectivityButton.addEventListener('click', () => {
		animationMode = (animationMode === 'connectivity') ? null : 'connectivity'
		updateButtonStyles()
	})


	//  Create an "Evaluate" button

	const evaluateButton = createDiv()
	toolbarEl.appendChild(evaluateButton)
	evaluateButton.classList.add('C-circuit-button', 'C-circuit-button-evaluate')
	evaluateButton.setAttribute('title', 'Evaluate circuit')
	evaluateButton.innerText = 'RUN'


	// ... (rest of the setup code) ...




	//  Create a circuit board container

	const boardContainerEl = createDiv()
	circuitEl.appendChild(boardContainerEl)
	boardContainerEl.classList.add('C-circuit-board-container')
	boardContainerEl.addEventListener('mousemove', C.Circuit.Editor.onPointerMove)
	boardContainerEl.addEventListener('mouseleave', function () {
		C.Circuit.Editor.unhighlightAll(circuitEl)
	})

	const boardEl = createDiv()
	boardContainerEl.appendChild(boardEl)
	boardEl.classList.add('C-circuit-board')

	const backgroundEl = createDiv()
	boardEl.appendChild(backgroundEl)
	backgroundEl.classList.add('C-circuit-board-background')


	//  Create background wires for each bit

	for (let i = 0; i < circuit.bandwidth; i++) {

		const rowEl = createDiv()
		backgroundEl.appendChild(rowEl)
		rowEl.style.position = 'relative'
		rowEl.style.gridRowStart = i + 2
		rowEl.style.gridColumnStart = 1
		rowEl.style.gridColumnEnd = C.Circuit.Editor.momentIndexToGridColumn(circuit.timewidth) + 1
		rowEl.setAttribute('register-index', i + 1)

		const wireEl = createDiv()
		rowEl.appendChild(wireEl)
		wireEl.classList.add('C-circuit-register-wire')
	}

	//  Helper to draw intermediate wires
	C.Circuit.Editor.drawIntermediateWires = function (circuitEl) {
		const
			circuit = circuitEl.circuit,
			backgroundEl = circuitEl.querySelector('.C-circuit-board-background')

		// Clear existing intermediate wires
		const existing = backgroundEl.querySelectorAll('.C-circuit-intermediate-wire')
		existing.forEach(el => el.remove())

		// Find all intermediate wires
		const intermediateWires = new Set()
		circuit.operations.forEach(function (op) {
			if (op.outputWire && op.outputWire % 1 !== 0) {
				intermediateWires.add(op.outputWire)
			}
		})

		// Draw them
		intermediateWires.forEach(function (wireIndex) {
			const rowEl = createDiv()
			backgroundEl.appendChild(rowEl)
			rowEl.classList.add('C-circuit-intermediate-wire')
			rowEl.style.position = 'relative'
			// Position: For wire 1.5, we want it between wire 1 (row 2) and wire 2 (row 3)
			// Wire 1 is in grid row 2, wire 2 is in grid row 3
			// So wire 1.5 should be in grid row 3, then pushed UP with top: 0 and translateY(-50%)
			// Use ceil instead of floor: ceil(1.5) = 2, +1 = 3 (correct!)
			const rowIndex = Math.ceil(wireIndex) + 1
			rowEl.style.gridRowStart = rowIndex
			rowEl.style.gridRowEnd = rowIndex + 1
			rowEl.style.gridColumnStart = 1
			rowEl.style.gridColumnEnd = C.Circuit.Editor.momentIndexToGridColumn(circuit.timewidth) + 1
			rowEl.style.zIndex = '0'
			rowEl.setAttribute('wire-index', wireIndex)

			const wireEl = createDiv()
			rowEl.appendChild(wireEl)
			wireEl.classList.add('C-circuit-register-wire')
			wireEl.style.borderTopStyle = 'dashed'
			// Position at top of row, then shift up by 50% to center between rows
			wireEl.style.position = 'absolute'
			wireEl.style.top = '0'
			wireEl.style.transform = 'translateY(-50%)'
		})
	}

	// Initial draw
	C.Circuit.Editor.drawIntermediateWires(circuitEl)


	//  Create background highlight bars for each column

	for (let i = 0; i < circuit.timewidth; i++) {

		const columnEl = createDiv()
		backgroundEl.appendChild(columnEl)
		columnEl.style.gridRowStart = 2
		columnEl.style.gridRowEnd = C.Circuit.Editor.registerIndexToGridRow(circuit.bandwidth) + 1
		columnEl.style.gridColumnStart = i + 3
		columnEl.setAttribute('moment-index', i + 1)
	}


	//  Create a foreground container for operations

	const foregroundEl = createDiv()
	boardEl.appendChild(foregroundEl)
	foregroundEl.classList.add('C-circuit-board-foreground')


	//  Create the "Select All" button in the top-left corner

	const selectallEl = createDiv()
	foregroundEl.appendChild(selectallEl)
	selectallEl.classList.add('C-circuit-header', 'C-circuit-selectall')
	selectallEl.setAttribute('title', 'Select all')
	selectallEl.setAttribute('moment-index', '0')
	selectallEl.setAttribute('register-index', '0')
	selectallEl.innerHTML = '&searr;'  		// ↘ arrow
	selectallEl.addEventListener('mouseenter', function (event) {
		// If hovering over select-all button, highlight all rows and columns
		if (event.target.closest('.C-circuit-selectall')) {
			const backgroundEl = boardContainerEl.querySelector('.C-circuit-board-background')
			// Only highlight rows (register-index) to avoid covering wires with columns
			Array.from(backgroundEl.querySelectorAll('div[register-index]'))
				.forEach(function (el) {
					el.classList.add('C-circuit-cell-highlighted')
				})
			return
		}
	})
	selectallEl.addEventListener('mouseleave', function () {
		const backgroundEl = circuitEl.querySelector('.C-circuit-board-background')
		Array.from(backgroundEl.querySelectorAll('div')).forEach(function (el) {
			el.classList.remove('C-circuit-cell-highlighted')
		})
	})



	//  Add register index symbols to left-hand column

	for (let i = 0; i < circuit.bandwidth; i++) {

		const labelEl = createDiv()
		foregroundEl.appendChild(labelEl)
		labelEl.classList.add('C-circuit-header', 'C-circuit-register-label')
		labelEl.innerText = 'b' + (i + 1)
		labelEl.style.gridRowStart = i + 2
		labelEl.style.gridColumnStart = 2
		labelEl.setAttribute('register-index', i + 1)
	}


	//  Add moment index symbols to top row

	for (let i = 0; i < circuit.timewidth; i++) {

		const labelEl = createDiv()
		foregroundEl.appendChild(labelEl)
		labelEl.classList.add('C-circuit-header', 'C-circuit-moment-label')
		labelEl.innerText = i + 1
		labelEl.style.gridRowStart = 1
		labelEl.style.gridColumnStart = i + 3
		labelEl.setAttribute('moment-index', i + 1)
	}


	//  Add input values

	circuit.bits.forEach(function (bit, i) {

		const
			rowIndex = i + 1,
			inputEl = createDiv()

		inputEl.classList.add('C-circuit-header', 'C-circuit-input')
		inputEl.setAttribute('title', `Bit #${rowIndex} starting value`)
		inputEl.setAttribute('register-index', rowIndex)
		inputEl.style.gridRowStart = C.Circuit.Editor.registerIndexToGridRow(rowIndex)
		inputEl.innerText = bit.value
		foregroundEl.appendChild(inputEl)
	})


	//  Add placeholder cells for each grid position

	for (let m = 0; m < circuit.timewidth; m++) {
		for (let r = 0; r < circuit.bandwidth; r++) {

			const
				momentIndex = m + 1,
				registerIndex = r + 1,
				cellEl = createDiv()

			cellEl.classList.add('C-circuit-cell')
			cellEl.setAttribute('moment-index', momentIndex)
			cellEl.setAttribute('register-index', registerIndex)
			cellEl.style.gridRowStart = C.Circuit.Editor.registerIndexToGridRow(registerIndex)
			cellEl.style.gridColumnStart = C.Circuit.Editor.momentIndexToGridColumn(momentIndex)
			foregroundEl.appendChild(cellEl)
		}
	}


	//  Add operations

	circuit.operations.forEach(function (operation) {

		C.Circuit.Editor.set(circuitEl, operation)
	})


	//  Add event listeners

	circuitEl.addEventListener('mousedown', C.Circuit.Editor.onPointerPress)
	circuitEl.addEventListener('touchstart', C.Circuit.Editor.onPointerPress)
	window.addEventListener(

		'C.Circuit.set$',
		C.Circuit.Editor.prototype.onExternalSet.bind(this)
	)
	window.addEventListener(

		'C.Circuit.clear$',
		C.Circuit.Editor.prototype.onExternalClear.bind(this)
	)


	//  Create results display area

	const resultsEl = createDiv()
	circuitEl.appendChild(resultsEl)
	resultsEl.classList.add('C-circuit-results')


	//  Add reference text

	const referenceEl = document.createElement('p')
	circuitEl.appendChild(referenceEl)
	referenceEl.innerHTML = `
		This circuit is accessible in your JavaScript console
		as <code>document.getElementById('${this.domId}').circuit</code>`


	//  Log to console

	C.log(0.5,

		`\n\nCreated a DOM interface for circuit #${this.index}\n\n`,
		circuit.toDiagram(),
		'\n\n\n'
	)

	// Initial style update (must be after DOM is built)
	updateButtonStyles()
}


//  Augment C.Circuit to have this functionality.

C.Circuit.toDom = function (circuit, targetEl) {

	return new C.Circuit.Editor(circuit, targetEl).domElement
}
C.Circuit.prototype.toDom = function (targetEl) {

	return new C.Circuit.Editor(this, targetEl).domElement
}




Object.assign(C.Circuit.Editor, {

	index: 0,
	help: function () { return C.help(this) },
	dragEl: null,
	currentGateSymbol: null,  // No default gate selected
	gateList: ['NOT', 'AND', 'OR', 'NAND', 'NOR', 'XOR', 'XNOR', 'BUF'],
	gridColumnToMomentIndex: function (gridColumn) { return +gridColumn - 2 },
	momentIndexToGridColumn: function (momentIndex) { return momentIndex + 2 },
	gridRowToRegisterIndex: function (gridRow) { return +gridRow - 1 },
	registerIndexToGridRow: function (registerIndex) { return registerIndex + 1 },
	gridSize: 4,
	pointToGrid: function (p) {

		const rem = parseFloat(getComputedStyle(document.documentElement).fontSize)
		return 1 + Math.floor(p / (rem * C.Circuit.Editor.gridSize))
	},
	gridToPoint: function (g) {

		const rem = parseFloat(getComputedStyle(document.documentElement).fontSize)
		return rem * C.Circuit.Editor.gridSize * (g - 1)
	},
	getInteractionCoordinates: function (event, pageOrClient) {

		if (typeof pageOrClient !== 'string') pageOrClient = 'client'
		if (event.changedTouches &&
			event.changedTouches.length) return {

				x: event.changedTouches[0][pageOrClient + 'X'],
				y: event.changedTouches[0][pageOrClient + 'Y']
			}
		return {

			x: event[pageOrClient + 'X'],
			y: event[pageOrClient + 'Y']
		}
	},

	// Helper to get visual representation for gate
	getGateIcon: function (gate) {
		const icons = {
			'NOT': '¬',      // NOT symbol
			'AND': '∧',      // AND symbol
			'OR': '∨',       // OR symbol
			'NAND': '⊼',     // NAND symbol
			'NOR': '⊽',      // NOR symbol
			'XOR': '⊕',      // XOR symbol (circled plus)
			'XNOR': '⊙',     // XNOR symbol (circled dot)
			'BUF': '▷',      // Buffer (triangle)
			'AND3': '∧₃',    // 3-input AND
			'OR3': '∨₃',     // 3-input OR
			'I': '—',        // Identity (line)
			'P': '◉'         // Probe (filled circle)
		}
		return icons[gate.symbol] || gate.symbol
	},

	set: function (circuitEl, operation) {

		const
			circuit = circuitEl.circuit,
			foregroundEl = circuitEl.querySelector('.C-circuit-board-foreground'),
			momentIndex = operation.momentIndex,
			registerIndex = operation.registerIndices[0],
			gate = operation.gate

		//  Check if operation already exists
		const existingEl = foregroundEl.querySelector(
			`.C-circuit-operation[moment-index="${momentIndex}"][register-index="${registerIndex}"]`
		)
		if (existingEl) {
			existingEl.remove()
		}

		//  Create operation element (matches Q.js structure)
		const operationEl = document.createElement('div')
		foregroundEl.appendChild(operationEl)
		operationEl.classList.add('C-circuit-operation')
		operationEl.classList.add('C-circuit-operation-' + operation.gate.nameCss)

		operationEl.setAttribute('gate-symbol', operation.gate.symbol)
		operationEl.setAttribute('moment-index', momentIndex)
		operationEl.setAttribute('register-index', registerIndex)

		// Handle fractional register indices (intermediate wires)
		if (registerIndex % 1 !== 0) {
			// Place in the row above (floor) and offset down by half a row (2rem)
			operationEl.style.gridRowStart = Math.floor(registerIndex) + 1
			operationEl.style.transform = 'translateY(2rem)'
		} else {
			operationEl.style.gridRowStart = C.Circuit.Editor.registerIndexToGridRow(registerIndex)
		}

		operationEl.style.gridColumnStart = C.Circuit.Editor.momentIndexToGridColumn(momentIndex)

		// Make multi-wire gates span across rows visually
		if (gate.wireSpan > 1) {
			const endRegister = operation.registerIndices[operation.registerIndices.length - 1]
			// Ensure gridRowEnd is an integer
			let endRow = Math.floor(C.Circuit.Editor.registerIndexToGridRow(endRegister + 1))

			// Fix for fractional start (intermediate wires):
			// Since we shift the whole block down by 0.5 row (2rem) using transform,
			// we need to compensate to avoid it being too tall/low.
			if (registerIndex % 1 !== 0) {
				if (endRegister % 1 === 0) {
					// If ending on an integer wire (e.g. 1.5 -> 3), we still overshoot by 0.5 row due to the shift
					// So reduce height by 2rem
					operationEl.style.height = 'calc(100% - 2rem)'
				}
			}

			operationEl.style.gridRowEnd = endRow
			console.log('Setting gate to span from row', registerIndex, 'to', endRegister, '- gridRowEnd:', endRow)
		}

		// Create operation tile (like Q.js)
		const tileEl = document.createElement('div')
		tileEl.classList.add('C-circuit-operation-tile')

		// Use icon instead of plain text
		const icon = C.Circuit.Editor.getGateIcon(gate)
		tileEl.innerHTML = icon

		// Add title attribute for clarity
		tileEl.setAttribute('title', gate.name)

		operationEl.appendChild(tileEl)

		return operationEl
	},


	clear: function (circuitEl, operation) {

		const foregroundEl = circuitEl.querySelector('.C-circuit-board-foreground')
		const operationEl = foregroundEl.querySelector(
			`.C-circuit-operation[moment-index="${operation.momentIndex}"][register-index="${operation.registerIndices[0]}"]`
		)
		if (operationEl) {
			operationEl.remove()
		}
	},


	unhighlightAll: function (circuitEl) {

		Array.from(circuitEl.querySelectorAll(

			'.C-circuit-board-background > div,' +
			'.C-circuit-board-foreground > div'
		))
			.forEach(function (el) {

				el.classList.remove('C-circuit-cell-highlighted')
			})
	},


	onPointerMove: function (event) {

		const
			{ x, y } = C.Circuit.Editor.getInteractionCoordinates(event),
			foundEls = document.elementsFromPoint(x, y),
			boardContainerEl = foundEls.find(function (el) {

				return el.classList.contains('C-circuit-board-container')
			})

		//  Are we dragging something?
		if (C.Circuit.Editor.dragEl !== null) {

			event.preventDefault()

			// Use fixed positioning (viewport coordinates)
			// Gate is 4rem x 4rem (approx 64px x 64px), center it on cursor
			C.Circuit.Editor.dragEl.style.left = (x - 32) + 'px'
			C.Circuit.Editor.dragEl.style.top = (y - 32) + 'px'

			if (!boardContainerEl && C.Circuit.Editor.dragEl.circuitEl) {
				C.Circuit.Editor.dragEl.classList.add('C-circuit-clipboard-danger')
			}
			else {
				C.Circuit.Editor.dragEl.classList.remove('C-circuit-clipboard-danger')
			}
		}

		if (!boardContainerEl) return

		const circuitEl = boardContainerEl.closest('.C-circuit')
		if (circuitEl.classList.contains('C-circuit-locked')) return

		// If hovering over select-all button, let the event listeners handle it
		if (event.target.closest('.C-circuit-selectall')) return

		//  Unhighlight everything first
		Array.from(boardContainerEl.querySelectorAll(`

			.C-circuit-board-background > div,
			.C-circuit-board-foreground > div

		`)).forEach(function (el) {

			el.classList.remove('C-circuit-cell-highlighted')
		})

		//  Calculate which cell we're over
		const
			boardElBounds = boardContainerEl.getBoundingClientRect(),
			xLocal = x - boardElBounds.left + boardContainerEl.scrollLeft + 1,
			yLocal = y - boardElBounds.top + boardContainerEl.scrollTop + 1,
			columnIndex = C.Circuit.Editor.pointToGrid(xLocal),
			rowIndex = C.Circuit.Editor.pointToGrid(yLocal),
			momentIndex = C.Circuit.Editor.gridColumnToMomentIndex(columnIndex),
			registerIndex = C.Circuit.Editor.gridRowToRegisterIndex(rowIndex)

		if (momentIndex > circuitEl.circuit.timewidth ||
			registerIndex > circuitEl.circuit.bandwidth) return

		if (momentIndex < 1 || registerIndex < 1) return

		//  Highlight the current cell
		Array.from(boardContainerEl.querySelectorAll(`

			div[moment-index="${momentIndex}"],
			div[register-index="${registerIndex}"]
		`))
			.forEach(function (el) {

				el.classList.add('C-circuit-cell-highlighted')
			})
	},


	onPointerPress: function (event) {

		//  Safety check
		if (C.Circuit.Editor.dragEl !== null) {
			C.Circuit.Editor.onPointerRelease(event)
			return
		}

		const
			targetEl = event.target,
			circuitEl = targetEl.closest('.C-circuit'),
			paletteEl = targetEl.closest('.C-circuit-palette')

		if (!circuitEl && !paletteEl) return

		const dragEl = document.createElement('div')
		dragEl.classList.add('C-circuit-clipboard')
		const { x, y } = C.Circuit.Editor.getInteractionCoordinates(event)

		//  Handle circuit interactions
		if (circuitEl) {

			const
				circuit = circuitEl.circuit,
				circuitIsLocked = circuitEl.classList.contains('C-circuit-locked'),
				lockEl = targetEl.closest('.C-circuit-toggle-lock')

			//  Toggle lock
			if (lockEl) {
				if (circuitIsLocked) {
					circuitEl.classList.remove('C-circuit-locked')
					lockEl.innerText = '🔓'
				}
				else {
					circuitEl.classList.add('C-circuit-locked')
					lockEl.innerText = '🔒'
					C.Circuit.Editor.unhighlightAll(circuitEl)
				}
				event.preventDefault()
				event.stopPropagation()
				return
			}

			if (circuitIsLocked) return

			const
				undoEl = targetEl.closest('.C-circuit-button-undo'),
				redoEl = targetEl.closest('.C-circuit-button-redo'),
				evaluateEl = targetEl.closest('.C-circuit-button-evaluate'),
				selectallEl = targetEl.closest('.C-circuit-selectall'),
				cellEl = targetEl.closest('.C-circuit-cell'),
				operationEl = targetEl.closest('.C-circuit-operation')

			event.preventDefault()
			event.stopPropagation()

			//  Handle toolbar buttons
			if (undoEl) {
				circuit.history.undo$()
				return
			}
			if (redoEl) {
				circuit.history.redo$()
				return
			}
			if (evaluateEl) {
				circuit.evaluate$()
				const resultsEl = circuitEl.querySelector('.C-circuit-results')
				resultsEl.innerText = circuit.report$()
				return
			}

			//  Handle select-all button
			if (selectallEl) {
				const operations = Array.from(circuitEl.querySelectorAll('.C-circuit-operation'))
				const selectedCount = operations.reduce(function (sum, el) {
					return sum + (el.classList.contains('C-circuit-cell-selected') ? 1 : 0)
				}, 0)

				// If all are selected, deselect all. Otherwise, select all.
				if (selectedCount === operations.length) {
					operations.forEach(function (el) {
						el.classList.remove('C-circuit-cell-selected')
					})
				} else {
					operations.forEach(function (el) {
						el.classList.add('C-circuit-cell-selected')
					})
				}
				return
			}

			//  Handle clicking on existing operation - drag to move
			if (operationEl) {

				const
					momentIndex = +operationEl.getAttribute('moment-index'),
					registerIndex = +operationEl.getAttribute('register-index'),
					gateSymbol = operationEl.getAttribute('gate-symbol')

				// Set as current gate
				C.Circuit.Editor.currentGateSymbol = gateSymbol

				// Create drag element
				const dragEl = document.createElement('div')
				dragEl.classList.add('C-circuit-clipboard')

				const clonedOp = operationEl.cloneNode(true)
				// Remove grid positioning from the clone
				clonedOp.style.gridRowStart = ''
				clonedOp.style.gridColumnStart = ''
				clonedOp.style.gridRowEnd = ''
				clonedOp.style.gridColumnEnd = ''
				clonedOp.style.left = ''
				clonedOp.style.top = ''
				clonedOp.style.position = ''

				dragEl.appendChild(clonedOp)
				dragEl.originEl = circuitEl
				dragEl.offsetX = 0
				dragEl.offsetY = 0
				dragEl.timestamp = Date.now()

				document.body.appendChild(dragEl)
				C.Circuit.Editor.dragEl = dragEl

				// Remove the original gate from the circuit (pick it up)
				circuit.clear$(momentIndex, registerIndex)

				// Start dragging immediately
				C.Circuit.Editor.onPointerMove(event)

				return
			}
			// Click-to-place removed - gates must be dragged from palette
		}

		//  Handle palette interactions - drag gate from palette
		else if (paletteEl) {

			const operationEl = targetEl.closest('.C-circuit-operation')

			if (!operationEl) return

			const
				bounds = operationEl.getBoundingClientRect(),
				gateSymbol = operationEl.getAttribute('gate-symbol')

			//  Set as current gate and clone for dragging
			C.Circuit.Editor.currentGateSymbol = gateSymbol

			dragEl.appendChild(operationEl.cloneNode(true))
			dragEl.originEl = paletteEl
			dragEl.offsetX = bounds.left - x
			dragEl.offsetY = bounds.top - y
			dragEl.timestamp = Date.now()

			document.body.appendChild(dragEl)
			C.Circuit.Editor.dragEl = dragEl
			C.Circuit.Editor.onPointerMove(event)
		}
	},


	onPointerRelease: function (event) {

		if (C.Circuit.Editor.dragEl === null) return

		event.preventDefault()
		event.stopPropagation()

		const
			dragEl = C.Circuit.Editor.dragEl,
			{ x, y } = C.Circuit.Editor.getInteractionCoordinates(event),
			foundEls = document.elementsFromPoint(x, y),
			boardContainerEl = foundEls.find(function (el) {
				return el.classList.contains('C-circuit-board-container')
			})

		//  If we found a circuit board, place the gate
		if (boardContainerEl) {

			const
				circuitEl = boardContainerEl.closest('.C-circuit'),
				circuit = circuitEl.circuit,
				boardElBounds = boardContainerEl.getBoundingClientRect(),
				xLocal = x - boardElBounds.left + boardContainerEl.scrollLeft + 1,
				yLocal = y - boardElBounds.top + boardContainerEl.scrollTop + 1,
				columnIndex = C.Circuit.Editor.pointToGrid(xLocal),

				// Calculate fractional register index for intermediate wires
				rem = parseFloat(getComputedStyle(document.documentElement).fontSize),
				gridSize = C.Circuit.Editor.gridSize,
				gridUnit = rem * gridSize,
				// For single resolution:
				// Row 2 -> Reg 1
				// Row 3 -> Reg 2
				// Center of Row 2 is at 2.5 grid units. We want this to be Index 1.0.
				// Boundary between Row 2/3 is at 3.0 grid units. We want this to be Index 1.5.
				// So: Index = Row - 1.5
				rawGridRow = 1 + (yLocal / gridUnit),
				exactRegisterIndex = rawGridRow - 1.5

			let registerIndex = Math.round(exactRegisterIndex)

			// Check if we should snap to half-integer (intermediate wire)
			// Only if we are close to X.5
			const diff = Math.abs(exactRegisterIndex - registerIndex)
			if (diff > 0.25) { // If we are far from integer, snap to half
				registerIndex = Math.floor(exactRegisterIndex) + 0.5
			}

			const momentIndex = C.Circuit.Editor.gridColumnToMomentIndex(columnIndex)
			// const registerIndex = C.Circuit.Editor.gridRowToRegisterIndex(rowIndex) // Replaced by fractional calc above

			if (momentIndex >= 1 && momentIndex <= circuit.timewidth &&
				registerIndex >= 1 && registerIndex <= circuit.bandwidth) {

				console.log('=== DRAG AND DROP ===')
				console.log('Current gate symbol:', C.Circuit.Editor.currentGateSymbol)
				console.log('Dropping at moment:', momentIndex, 'register:', registerIndex)

				const gate = C.Gate.findBySymbol(C.Circuit.Editor.currentGateSymbol)
				console.log('Gate found:', gate)
				console.log('Gate wireSpan:', gate ? gate.wireSpan : 'undefined')

				// Check if this is a multi-wire gate
				if (gate && gate.wireSpan > 1) {
					console.log('Multi-wire gate detected!')
					const wireIndices = []
					// First wire is always the drop location (e.g. 1.5)
					wireIndices.push(registerIndex)

					// For subsequent wires, we want to skip the "component" wires if starting on a fraction
					// If start is 1.5 (between 1 and 2), next wire should be 3 (not 2.5, not 2)
					const startInteger = Math.ceil(registerIndex)

					for (let i = 1; i < gate.wireSpan; i++) {
						const wireIdx = startInteger + i
						console.log(`Calculating wire ${i}: startInteger=${startInteger} + i=${i} = ${wireIdx}`)
						if (wireIdx <= circuit.bandwidth) {
							wireIndices.push(wireIdx)
						}
					}
					console.log('Wire indices:', wireIndices, 'needed:', gate.wireSpan)
					if (wireIndices.length === gate.wireSpan) {
						console.log('Placing multi-wire gate with wires:', wireIndices)
						circuit.set$(C.Circuit.Editor.currentGateSymbol, momentIndex, ...wireIndices)
					} else {
						console.warn('Not enough wires available')
					}
				} else {
					console.log('Single-wire gate, placing at register:', registerIndex)
					circuit.set$(C.Circuit.Editor.currentGateSymbol, momentIndex, registerIndex)
				}
			}
		}
		//  Clean up drag element
		dragEl.remove()
		C.Circuit.Editor.dragEl = null
	},


	createPalette: function (targetEl) {

		if (typeof targetEl === 'string') targetEl = document.getElementById(targetEl)

		const
			paletteEl = targetEl instanceof HTMLElement ? targetEl : document.createElement('div')

		paletteEl.classList.add('C-circuit-palette')

		C.Circuit.Editor.gateList.forEach(function (symbol) {

			const gate = C.Gate.findBySymbol(symbol)
			if (!gate) return

			const operationEl = document.createElement('div')
			paletteEl.appendChild(operationEl)
			operationEl.classList.add('C-circuit-operation')
			operationEl.classList.add('C-circuit-operation-' + gate.nameCss)
			operationEl.setAttribute('gate-symbol', symbol)
			operationEl.setAttribute('title', gate.name)

			const tileEl = document.createElement('div')
			operationEl.appendChild(tileEl)
			tileEl.classList.add('C-circuit-operation-tile')

			// Use icon instead of plain text (same as in circuit)
			const icon = C.Circuit.Editor.getGateIcon(gate)
			tileEl.innerHTML = icon
		})

		// CRITICAL: Add event listeners to enable drag and drop!
		paletteEl.addEventListener('mousedown', C.Circuit.Editor.onPointerPress)
		paletteEl.addEventListener('touchstart', C.Circuit.Editor.onPointerPress)

		return paletteEl
	}
})


//  Add window event listeners for pointer move and release
window.addEventListener('mousemove', C.Circuit.Editor.onPointerMove)
window.addEventListener('touchmove', C.Circuit.Editor.onPointerMove)
window.addEventListener('mouseup', C.Circuit.Editor.onPointerRelease)
window.addEventListener('touchend', C.Circuit.Editor.onPointerRelease)




C.Circuit.Editor.prototype.onExternalSet = function (event) {

	if (event.detail.circuit === this.circuit) {

		C.Circuit.Editor.set(this.domElement, {

			gate: event.detail.circuit.get(
				event.detail.momentIndex,
				event.detail.registerIndices[0]
			).gate,
			momentIndex: event.detail.momentIndex,
			registerIndices: event.detail.registerIndices
		})

		// Redraw intermediate wires
		C.Circuit.Editor.drawIntermediateWires(this.domElement)

		// Invalidate trace data since circuit has changed
		this.circuit.trace = null

		// Update wire animations to show connectivity
		C.Circuit.Editor.updateWireAnimations(this.domElement)
	}
}


C.Circuit.Editor.prototype.onExternalClear = function (event) {

	if (event.detail.circuit === this.circuit) {

		C.Circuit.Editor.clear(this.domElement, {

			momentIndex: event.detail.momentIndex,
			registerIndices: event.detail.registerIndices
		})

		// Redraw intermediate wires
		C.Circuit.Editor.drawIntermediateWires(this.domElement)

		// Invalidate trace data since circuit has changed
		this.circuit.trace = null

		// Update wire animations to show connectivity
		C.Circuit.Editor.updateWireAnimations(this.domElement)
	}
}




window.addEventListener('C.Circuit.evaluate completed', function (event) {

	const circuitEl = document.querySelector('.C-circuit')
	if (circuitEl && circuitEl.circuit === event.detail.circuit) {
		C.Circuit.Editor.updateWireAnimations(circuitEl)
	}
})



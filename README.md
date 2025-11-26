# C.js - Classical Circuit Simulator

A classical (digital) circuit simulator inspired by the quantum circuit simulator Q.js. Build and test logic circuits using classical logic gates directly in your browser.

## Features

- **Classical Logic Gates**: AND, OR, NOT, NAND, NOR, XOR, XNOR, and more
- **Interactive Editor**: Drag-and-drop interface with real-time feedback
- **Multiple Input Formats**: Create circuits programmatically or via text notation
- **Real-time Evaluation**: Instant circuit evaluation with detailed results
- **History Support**: Undo/redo capabilities
- **Export**: Export circuits to text and diagrams

## Quick Start

```html
<!DOCTYPE html>
<html>
<head>
	<link rel="stylesheet" href="C.css">
	<link rel="stylesheet" href="C-Circuit-Editor.css">
</head>
<body>
	<div id="circuit"></div>

	<script src="C.js"></script>
	<script src="C-Bit.js"></script>
	<script src="C-Gate.js"></script>
	<script src="C-History.js"></script>
	<script src="C-Circuit.js"></script>
	<script src="C-Circuit-Editor.js"></script>

	<script>
		// Create a simple circuit
		const circuit = new C.Circuit(3, 5)
		circuit.bits[0] = C.Bit.ONE
		circuit.bits[1] = C.Bit.ZERO
		circuit.bits[2] = C.Bit.ONE

		// Add gates
		circuit.set$('NOT', 1, 1)
		circuit.set$('AND', 2, 2)
		circuit.set$('OR', 3, 3)

		// Create interactive editor
		circuit.toDom(document.getElementById('circuit'))
	</script>
</body>
</html>
```

## Installation

### Option 1: Use Bundled Files (Recommended)

Download the bundled files from the `dist/` folder:

```html
<link rel="stylesheet" href="path/to/c.css">
<script src="path/to/c.js"></script>
```

### Option 2: NPM Package

```bash
npm install c.js
```

## Building from Source

To create the bundled distribution files:

```bash
cd C
./build.sh
```

This generates `dist/c.js` and `dist/c.css`.

## Available Gates

- **NOT** - Inverts input
- **AND** - Output 1 if all inputs are 1
- **OR** - Output 1 if any input is 1
- **NAND** - Inverted AND
- **NOR** - Inverted OR
- **XOR** - Output 1 if inputs differ
- **XNOR** - Output 1 if inputs match
- **BUFFER** - No-op
- **PROBE** - Monitoring point

## Interactive Features

The circuit editor provides a fully interactive experience:

### Gate Placement
- **Click** empty cells to place the selected gate
- **Drag & Drop** gates from the palette
- **Click** existing gates to cycle through types

### Palette
```javascript
const palette = C.Circuit.Editor.createPalette()
document.body.appendChild(palette)
```

## API Reference

### C.Bit
Represents a classical bit (0 or 1).

```javascript
const bit = new C.Bit(1)
C.Bit.ZERO // 0
C.Bit.ONE  // 1
```

### C.Gate
Represents a logic gate operation.

```javascript
const notGate = C.Gate.findBySymbol('NOT')
const output = notGate.applyToInputs(new C.Bit(1))
```

### C.Circuit
Represents a complete circuit.

```javascript
const circuit = new C.Circuit(3, 5) // 3 wires, 5 steps
circuit.set$('AND', 1, 1) // Add gate
circuit.evaluate$()       // Run simulation
console.log(circuit.report$())
```

### C.Circuit.Editor
Interactive DOM-based editor.

```javascript
const editor = new C.Circuit.Editor(circuit, targetElement)
```

## Text-Based Creation

Create circuits using simple text notation:

```javascript
const circuit = C.Circuit.fromText(`
	NOT-AND-I
	I---OR--I
	I---I---XOR
`)
```

## Architecture

C.js follows a modular architecture:

- **C.js** - Main entry point and utilities
- **C-Bit.js** - Classical bit representation
- **C-Gate.js** - Logic gate definitions
- **C-Circuit.js** - Circuit structure and evaluation
- **C-History.js** - Undo/redo functionality
- **C-Circuit-Editor.js** - Interactive editor
- **C.css** - Core styles
- **C-Circuit-Editor.css** - Editor-specific styles

## Comparison with Q.js

| Feature | Q.js (Quantum) | C.js (Classical) |
|---------|---------------|------------------|
| Basic Unit | Qubit (superposition) | Bit (0 or 1) |
| Gates | Quantum gates (H, X, Y, Z, CNOT) | Logic gates (AND, OR, NOT, etc.) |
| State | Complex probability amplitudes | Deterministic 0 or 1 |
| Evaluation | Matrix multiplication | Boolean logic |
| Output | Probability distribution | Exact bit values |

## Browser Support

C.js works in all modern browsers that support ES6:

- Chrome/Edge 51+
- Firefox 54+
- Safari 10+

## License

MIT License. See [LICENSE.md](LICENSE.md) for details.

## Credits

Based on [Q.js](https://quantumjavascript.app/) by Stewart Smith.

## Contributing

Contributions are welcome! Feel free to submit issues and pull requests at [https://github.com/hasarinduperera/c.js](https://github.com/hasarinduperera/c.js).

## Learn More

For more information about classical digital circuits and logic gates:
- [Digital Logic](https://en.wikipedia.org/wiki/Logic_gate)
- [Boolean Algebra](https://en.wikipedia.org/wiki/Boolean_algebra)
- [Digital Electronics](https://en.wikipedia.org/wiki/Digital_electronics)

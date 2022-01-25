// Module Includes
//=============================================================================================
const fs = require('fs');
const util = require('util');

// Override Console log
//=============================================================================================
let logStdout = process.stdout;
let logStderr = process.stderr;

const dateoptionsLog = { weekday: 'short', year: 'numeric', month: 'numeric', day: 'numeric' };

const validatePath = (path) => {
	if (!fs.existsSync(path)) {
		fs.mkdirSync(path, { recursive: true }, (err) => {
			if (err) throw err;
		});
	}
}

/**
 * Overrides the default `console.log()` with a modified version that additiononly writes the output to `path`.
 */
const overrideConsoleLog = function (path, filename = "common.log") {
	validatePath(path);
	let logFile = fs.createWriteStream(path + filename, { flags: 'a' });
	console.log = function () {
		let d = new Date();
		const time = d.toLocaleTimeString(undefined, dateoptionsLog);
		const text = `[${time}] ${util.format.apply(null, arguments)}\n`;
		logFile.write(text);
		logStdout.write(text);
	}
	console.log("Set common log path to: " + path + filename);
}

/**
 * Overrides the default `console.error()` with a modified version that additiononly writes the output to `path`.
 */
const overrideConsoleError = function (path, filename = "error.log") {
	validatePath(path);
	let logError = fs.createWriteStream(path + filename, { flags: 'a' });
	console.error = function () {
		let d = new Date();
		const time = d.toLocaleTimeString(undefined, dateoptionsLog);
		const text = `[${time}] ${util.format.apply(null, arguments)}\n`;
		logError.write(text);
		logStderr.write(text);
	}
	console.log("Set error log path to: " + path + filename);
}

/**
 * Overrides both the default `console.log()` and `console.error()` with a modified version that additiononly writes the output to `path`.
 */
const overrideConsoleAll = function (path) {
	overrideConsoleLog(path);
	overrideConsoleError(path);
}


module.exports.overrideConsoleLog = overrideConsoleLog;
module.exports.overrideConsoleError = overrideConsoleError;
module.exports.overrideConsoleAll = overrideConsoleAll;
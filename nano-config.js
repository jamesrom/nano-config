var fs = require('fs');
var path = require('path');
var _file;

function load(file) {
	_file = path.normalize(file);
	var config = {};

	if (fs.existsSync(_file)) {
		var contents = fs.readFileSync(_file);
		if (contents.length > 0) {
			try {
				config = module.exports.deserialize(contents);
			}
			catch (ex) {
				throw 'Deserialization failed.';
			}
		}
	}

	for (var prop in module.exports) {
		if (!isReserved(prop)) {
			delete module.exports[prop];
		}
	}

	// export the loaded config
	for (var prop in config) {
		if (isReserved(prop)) {
			module.exports['_' + prop] = config[prop];
		}
		else {
			module.exports[prop] = config[prop];
		}
	}

	// return self
	return module.exports;
}

function save(callback) {
	var config = {};
	for (var prop in module.exports) {
		if (!isReserved(prop)) {
			config[prop] = module.exports[prop];
		}
	}

	if (!callback) {
		fs.writeFileSync(_file, module.exports.serialize(config);
		return;
	}

	fs.writeFile(_file, module.exports.serialize(config), callback);
}

function serialize(obj) {
	return JSON.stringify(obj, null, "\t");
}

function deserialize(string) {
	return JSON.parse(string);
}

function isReserved(string) {
	return ['load', 'save', 'serialize', 'deserialize'].indexOf(string) !== -1;
}

module.exports = load;
module.exports.save = save;
module.exports.serialize = serialize;
module.exports.deserialize = deserialize;
load('./config.json');

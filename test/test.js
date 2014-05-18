var assert = require('assert');
var fs = require('fs');
var path = require('path');
var config = require('../nano-config');

describe('nano-config', function() {
	before(function(done) {
		deleteFiles([
			'./config.json',
			'./new-config.json',
			'./custom-serializer.min.json'
		], done);
	});

	it('should create default config file', function(done) {
		config.save(function(err) {
			assert(!err);
			fs.exists('./config.json', function(exists) {
				assert(exists);
				done();
			});
		});
	});

	it('should write valid JSON to file', function(done) {
		config('./config.json');
		config.hello = 'world';
		assert.equal(config.hello, 'world');
		config.save(function(err) {
			assert(!err);
			fs.readFile('./config.json', function(err, contents) {
				assert(!err);
				var temp = JSON.parse(contents);
				assert.equal(temp.hello, config.hello);
				done();
			});
		});
	});

	it('should create a new file if it doesn\'t exist', function(done) {
		assert(!fs.existsSync('./new-config.json'));
		config('./new-config.json');
		config.save(function(err) {
			assert(!err);
			fs.exists('./new-config.json', function(exists) {
				assert(exists);
				done();
			});
		});
	});

	it('should load a new file and forget the old', function() {
		config.hello = 'world';
		assert.equal(config.hello, 'world');
		config('./test-config.json');
		assert.notEqual(config.hello, 'world');
	});

	it('should rename reserved words at the top level', function() {
		config('./test-config.json');
		assert(config["_save"]);
	});

	it('should allow custom serializers', function(done) {
		var called = false;
		config.serialize = function(obj) {
			called = true;
			return JSON.stringify(obj);
		};
		config('./custom-serializer.min.json');
		config.abc = ['a', 'b', 'c'];
		config.def = {d: 'd', e: 'e', f: 'f'};
		config.save(function(err) {
			assert(!err);
			assert(called);
			fs.readFile('./custom-serializer.min.json', 'utf8', function(err, contents) {
				assert.equal(contents, '{"abc":["a","b","c"],"def":{"d":"d","e":"e","f":"f"}}');
				done();
			});
		});
	});

	it('should allow custom deserializers', function() {
		var called = false;
		config.deserialize = function(string) {
			called = true;
			return JSON.parse(string);
		};
		config('./custom-serializer.min.json');
		assert(called);
	});

	after(function(done) {
		deleteFiles([
			'./config.json',
			'./new-config.json',
			'./custom-serializer.min.json'
		], done);
	});
});

function deleteFiles(files, callback) {
	var countdown = files.length;
	for (var i = 0; i < files.length; i++) {
		deleteFile(files[i], function() {
			countdown--;
			if (countdown == 0) {
				callback();
			}
		});
	}
}

function deleteFile(file, callback) {
	fs.exists(file, function (exists) {
		if (exists) {
			fs.unlink(file, callback);
		}
		else {
			callback();
		}
	});
}

[![nano-config logo](http://istheblockchainforked.com/script/nano-config.png)](http://expressjs.com/)

A simple, dependency-free configuration helper with a nano API.

```js
var config = require('nano-config')('./my-configuration.json');
config.greet = 'world';
config.save()
```
Loads `my-configuration.json`. If it doesn't exist it will be created when you call `save`.
```json
{
	"greet": "world"
}
```

Okay, cool. You just saved some JSON. Who cares?

## It's global
You only need to load a configuration file once. Here's some other part of your application.
```js
var config = require('nano-config');
console.log('hello ' + config.greet);
```
Outputs
```
hello world
```
nano-config remembers the last config you loaded.
## It's simple
nano-config doesn't depend on any modules, doesn't care about environment variables and doesn't have a verbose API.

Do you need to load a specific configuration file for a specific environment? Do it yourself.
```js
var config = require('nano-config')('./' + process.env.NODE_ENV + '.json')
```

##It's flexible
Custom serialization. Prefer CSON?
```js
var CSON = require('cson');
var config = require('nano-config');
config.deserialize = function(string) {
	return CSON.parseSync(string);
}
config.serialize = function(obj) {
	return CSON.stringifySync(obj);
}
config('./my-config.cson');
```

## Full API Documentation
### config(file)
Loads a configuration file.
### config.save(callback)
Saves the current configuration to file. Optional callback is called when save is finished.
### config.serialize(obj)
The object serializer. It takes an object and returns a string.
### config.deserialize(string)
The string deserializer. It takes a string and returns an object.

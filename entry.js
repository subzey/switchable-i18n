console.log(`Loading ${module.id}`);

const { hello } = require('./hello');
const { goodbye } = require('./goodbye');

module.exports.doStuff = function() {
	console.log(hello());
	console.log(goodbye())
}

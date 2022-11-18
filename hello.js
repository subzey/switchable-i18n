console.log(`Loading ${module.id}`);

const i18next = require('i18next');

module.exports.hello = function() {
	return i18next.t('Hello!');
}
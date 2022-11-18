console.log(`Loading ${module.id}`);

const i18next = require('i18next');
require('./unrelated');

const NASTY_MODULE_LEVEL_TRANSLATION = i18next.t('Goodbye!');

module.exports.goodbye = function() {
	return NASTY_MODULE_LEVEL_TRANSLATION;
}
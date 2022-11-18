const i18next = require('i18next');
const { i18nSafeRequire } = require('./i18n-switch');

const translations = {
	'ru': {'translation': { 'Hello!': 'Привет!', 'Goodbye!': 'Пока!' }},
	'fr': {'translation': { 'Hello!': 'Bonjour!', 'Goodbye!': 'Au revoir!' }},
}

async function main() {
	await i18next.init({ resources: translations });
	for (const lang of [
		'en', 'fr', 'ru',
		'ru', 'fr', 'en',
	]) {
		await i18next.changeLanguage(lang);
		i18nSafeRequire('./entry').doStuff();
	}
}

main();
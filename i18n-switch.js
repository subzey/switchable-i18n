const i18next = require('i18next');

const selfModuleId = module.id;
const i18nModulePath = require.resolve('i18next');

let previousLang = undefined;

/** @type { Map<string, Record<string, NodeJS.Module>> } */
const requireCacheMap = new Map();

module.exports.i18nSafeRequire = function(moduleName) {
	const currentLang = i18next.language;
	console.log(`Current lang is ${currentLang}`);
	if (previousLang === undefined) {
		previousLang = currentLang;
	}
	if (previousLang !== currentLang) {
		let previousCache = requireCacheMap.get(previousLang);
		if (previousCache === undefined) {
			previousCache = Object.create(null);
			requireCacheMap.set(previousLang, previousCache);
		}

		const idsToReload = collectIdsToReload(i18nModulePath, getParentsIdsMap(), new Set());
		for (const key of idsToReload) {
			previousCache[key] = require.cache[key];
			delete require.cache[key];
		}

		let currentCache = requireCacheMap.get(currentLang);
		if (currentCache) {
			Object.assign(require.cache, currentCache);
		}

		previousLang = currentLang;
	}

	return require(moduleName);
};

function getParentsIdsMap() {
	/** @type Map<string, string[]> */
	const parentIdsMap = new Map();
	for (let moduleId in require.cache) {
		const parentModule = require.cache[moduleId];
		if (parentModule === undefined) {
			continue;
		}
		for (const childModule of parentModule.children) {
			// Ignore unrelated leaf nodes
			if (
				childModule.children.length === 0 &&
				childModule.path !== i18nModulePath
			) {
				continue;
			}

			let parentIds = parentIdsMap.get(childModule.id);
			if (parentIds === undefined) {
				parentIds = [];
				parentIdsMap.set(childModule.id, parentIds);
			}
			parentIds.push(parentModule.id);
		}
	}
	return parentIdsMap;
}

/** 
 * @param { string } moduleId
 * @param { ReadonlyMap<string, string[]> } parentIdsMap
 * @param { Set<string> } collectedIds 
 */
function collectIdsToReload(moduleId, parentIdsMap, collectedIds) {
	const parentsIds = parentIdsMap.get(moduleId) ?? [];
	for (const parentId of parentsIds) {
		if (parentId === selfModuleId) {
			// Stop on this module
			continue;
		}
		collectedIds.add(parentId);
		collectIdsToReload(parentId, parentIdsMap, collectedIds);
	}
	return collectedIds;
}
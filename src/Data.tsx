import { getDataFromFirebase } from '../shared/data';

// noinspection JSUnusedGlobalSymbols
export function getRecent(): Promise<object | null> {
	return getDataFromFirebase('/recentlyUsed/');
}

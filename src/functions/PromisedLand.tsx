import {
	type JsonData,
	type ApiResponseBody,
	type TruncatedJsonData,
	type NumDirectory
} from '../../shared/types.ts';

// Data Retrieval

export async function getLatestUsed(host: string) {
	const prefix =
		window.location.protocol === 'https:' ? 'https://' : 'http://';
	return (
		(await (
			await fetch(`${prefix}${host}/api?path=recentlyUsed`)
		).json()) as ApiResponseBody
	).data as JsonData[];
}

export async function getNumData(host: string) {
	const prefix =
		window.location.protocol === 'https:' ? 'https://' : 'http://';
	return (
		(await (
			await fetch(`${prefix}${host}/api?path=num`)
		).json()) as ApiResponseBody
	).data as NumDirectory;
}

export async function getCurrentlyUsed(host: string) {
	const prefix =
		window.location.protocol === 'https:' ? 'https://' : 'http://';
	return (
		(await (
			await fetch(`${prefix}${host}/api?path=latest`)
		).json()) as ApiResponseBody
	).data as TruncatedJsonData;
}

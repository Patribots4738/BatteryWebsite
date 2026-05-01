import { type Time } from '../../shared/types';

export function formatTime(time: Time): string {
	const oldHour = Number(time.hour);
	const minute = time.minute;

	const newMinutes =
		minute <= 9 ? '0' + minute.toString() : minute.toString();

	return oldHour >= 12
		? `${oldHour}:${newMinutes} pm`
		: `${oldHour}:${newMinutes} am`;
}

import { io, type Socket } from 'socket.io-client';
import type { SocketResponseTypes } from '../shared/types.ts';

export type SocketContextType = Socket<SocketResponseTypes>;

export const socket: SocketContextType = io(undefined, {
	autoConnect: false,
	withCredentials: true,
	transports: ['websocket']
});

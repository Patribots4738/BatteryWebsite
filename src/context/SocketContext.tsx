import { createContext, useContext } from 'react';
import type { SocketContextType } from '../Socket.ts';

export const SocketContext = createContext<SocketContextType | null>(null);

export function useSocket() {
	const context = useContext(SocketContext);
	if (!context) {
		throw new Error('useSocket must be used inside SocketContext.Provider');
	}
	return context;
}

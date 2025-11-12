import {createContext, useContext, useEffect, useMemo, useState} from 'react';
import {db} from '@/db';
import type {User} from '@/domain/types';
import {hashPassword, randomSalt} from '@/utils/crypto';


export type SessionUser = { id: string; email: string } | null;


type Ctx = {
	user: SessionUser;
	login: (email: string, password: string) => Promise<boolean>;
	register: (email: string, password: string) => Promise<{ ok: true } | { ok: false; reason: string }>;
	logout: () => void;
};


const AuthContext = createContext<Ctx | undefined>(undefined);


export function AuthProvider({children}: { children: React.ReactNode }) {
	const [user, setUser] = useState<SessionUser>(null);


	useEffect(() => {
		const raw = localStorage.getItem('auth.user');
		if (raw) setUser(JSON.parse(raw));
	}, []);


	const value = useMemo<Ctx>(() => ({
		user,
		logout: () => {
			localStorage.removeItem('auth.user');
			setUser(null);
		},
		login: async (email, password) => {
			const found = await db.users.get({email});
			if (!found) return false;
			const hp = await hashPassword(password, found.salt);
			if (hp !== found.passwordHash) return false;
			const session = {id: found.id, email: found.email};
			localStorage.setItem('auth.user', JSON.stringify(session));
			setUser(session);
			return true;
		},
		register: async (email, password) => {
			const exists = await db.users.get({email});
			if (exists) return {ok: false, reason: 'exists'} as const;
			const salt = randomSalt();
			const passwordHash = await hashPassword(password, salt);
			const user: User = {id: crypto.randomUUID(), email, passwordHash, salt, createdAt: Date.now()};
			await db.users.add(user);
			return {ok: true} as const;
		}
	}), [user]);


	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error('useAuth must be used within AuthProvider');
	return ctx;
}

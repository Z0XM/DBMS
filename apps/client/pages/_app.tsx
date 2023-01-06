import '../styles/globals.css';
import type { AppProps } from 'next/app';

import { Poppins } from '@next/font/google';
import { useState } from 'react';

import type { User } from './index.d';

const poppins = Poppins({ weight: '400' });

export default function App({ Component, pageProps }: AppProps) {
	const [userData, setUserData] = useState<User>();
	return (
		<main className={poppins.className}>
			<Component {...pageProps} userData={userData} setUserData={setUserData} />
		</main>
	);
}

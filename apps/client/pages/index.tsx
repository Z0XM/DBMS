import Head from 'next/head';
import { Rowdies } from '@next/font/google';
import styles from '../styles/Home.module.css';
import { Dispatch, SetStateAction, useRef, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

import type { User } from './index.d';

const rowdies = Rowdies({ weight: '400' });

export default function Home({
	userData,
	setUserData
}: {
	userData: User;
	setUserData: Dispatch<SetStateAction<User | undefined>>;
}) {
	const nameRef = useRef<HTMLInputElement | null>(null);
	const passRef = useRef<HTMLInputElement | null>(null);

	const [msg, setMsg] = useState('');

	const router = useRouter();

	const login = () => {
		const user = {
			username: nameRef.current!.value,
			password: passRef.current!.value
		};
		axios
			.post('http://localhost:4000/login', user)
			.then((res) => {
				console.log(res.data);
				if (res.data.login) {
					setUserData(user);
					router.push(`/dash`);
				} else {
					setMsg(res.data.msg);
				}
			})
			.catch(console.error);
	};

	return (
		<main
			style={{
				position: 'relative',
				height: '100vh',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center'
			}}>
			<div
				style={{
					position: 'relative',
					width: '95vw',
					height: '95vh',
					background: 'rgba(0,0,0,0.5)',
					borderRadius: '1.5rem',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center'
				}}>
				<div
					style={{ fontSize: '3.5rem', color: 'white', marginBottom: '25px' }}
					className={rowdies.className}>
					Welcome to <span className={styles.social}>Social</span>!
				</div>
				<form
					style={{
						fontSize: '1.5rem',
						color: 'white',
						display: 'flex',
						flexDirection: 'column',
						gap: '20px',
						justifyContent: 'center',
						alignItems: 'center'
					}}
					onSubmit={(e) => {
						e.preventDefault();
						login();
					}}>
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							height: '1.5em',
							gap: '10px'
						}}>
						<label>Enter Your Username</label>
						<input
							style={{
								height: '100%',
								font: 'inherit',
								fontSize: '1rem',
								border: 'none',
								borderRadius: '0.5rem',
								display: 'flex',
								justifyContent: 'flex-start',
								alignItems: 'center',
								paddingInline: '0.5rem'
							}}
							ref={nameRef}></input>
					</div>
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							height: '1.5em',
							gap: '10px'
						}}>
						<label>Enter Your Password</label>
						<input
							style={{
								height: '100%',
								font: 'inherit',
								fontSize: '1rem',
								border: 'none',
								borderRadius: '0.5rem',
								display: 'flex',
								justifyContent: 'flex-start',
								alignItems: 'center',
								paddingInline: '0.5rem'
							}}
							ref={passRef}></input>
					</div>
					<button
						type='submit'
						style={{
							paddingBlock: '0.5rem',
							paddingInline: '5rem',
							border: 'none',
							font: 'inherit',
							borderRadius: '20px',
							cursor: 'pointer'
						}}
						className={styles.loginanim}>
						Log In!
					</button>
				</form>
				<div
					style={{
						color: 'white',
						textDecorationLine: 'underline',
						textDecorationColor: 'red',
						marginTop: '20px'
					}}>
					{msg}
				</div>
			</div>
		</main>
	);
}

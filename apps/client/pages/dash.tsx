import Head from 'next/head';
import { Rowdies } from '@next/font/google';
import styles from '../styles/Home.module.css';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

import type { Posts, User } from './index.d';

const rowdies = Rowdies({ weight: '400' });

export default function Dash({
	userData,
	setUserData
}: {
	userData: User;
	setUserData: Dispatch<SetStateAction<User | undefined>>;
}) {
	const router = useRouter();

	const textRef = useRef<HTMLTextAreaElement | null>(null);
	const [posts, setPosts] = useState<Posts[]>([]);

	const reloadData = () => {
		axios
			.get('http://localhost:4000/post')
			.then((res) => {
				console.log(res.data);
				setPosts(res.data);
			})
			.catch(console.error);
	};

	const post = () => {
		axios
			.post('http://localhost:4000/post', {
				username_fk: userData.username,
				contents: textRef.current?.value
			})
			.then((res) => {
				console.log(res.data);
			})
			.catch(console.error);

		setTimeout(() => {
			reloadData();
		}, 1000);
	};

	useEffect(() => {
		if (!userData || !userData.username || !userData.password) {
			router.push('/');
		} else {
			reloadData();
		}
	}, []);

	return (
		<>
			<Head>
				<title>Create Next App</title>
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<main
				className={styles.main}
				style={{
					position: 'relative',
					height: 'auto',
					marginBlock: '5vh',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center'
				}}>
				{userData && (
					<div
						style={{
							position: 'relative',
							width: '95vw',
							minHeight: '95vh',
							paddingBlock: '5vh',
							background: 'rgba(0,0,0,0.5)',
							borderRadius: '1.5rem',
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: 'center',
							gap: '20px'
						}}>
						<div
							style={{ fontSize: '3.5rem', color: 'white', marginBottom: '25px' }}
							className={rowdies.className}>
							Welcome to <span className={styles.social}>Social</span>!
						</div>
						<div style={{ display: 'flex', gap: '20px' }}>
							<button
								className={styles.bttn}
								onClick={(e) => {
									e.preventDefault();
									post();
								}}>
								Create
							</button>
							<button
								className={styles.bttn}
								onClick={(e) => {
									e.preventDefault();
									reloadData();
								}}>
								Refresh
							</button>
						</div>
						<div
							style={{
								background: '#FAF9F6',
								borderRadius: '20px',
								width: '80%',
								paddingInline: '1.5rem',
								paddingBlock: '1rem'
							}}>
							<div style={{ fontSize: '1.2rem', color: '#e0115f' }}>
								{userData.username}
							</div>
							<textarea
								ref={textRef}
								style={{
									width: '97%',
									marginBlock: '10px',
									marginInline: '1.25%',
									borderRadius: '15px',
									border: '1px solid black',
									outline: 'none',
									minHeight: '4rem',
									paddingInline: '1rem',
									paddingBlock: '1rem'
								}}
							/>
						</div>
						{posts.map((post, i) => {
							return (
								<div
									key={i}
									style={{
										background: '#FAF9F6',
										borderRadius: '20px',
										width: '80%',
										paddingInline: '1.5rem',
										paddingBlock: '1rem'
									}}>
									<div style={{ fontSize: '1.2rem', color: '#e0115f' }}>
										{post.username_fk}
									</div>
									<div>{post.contents}</div>
									<button
										style={{
											border: 'none',
											background: 'none',
											color: 'red',
											fontSize: '1.2rem',
											cursor: 'pointer'
										}}
										className={styles.heart}>
										&#10084;
									</button>
									<span style={{ fontSize: '1.2rem', marginLeft: '0.25rem' }}>
										{post.count ?? 0}
									</span>
								</div>
							);
						})}
					</div>
				)}
			</main>
		</>
	);
}

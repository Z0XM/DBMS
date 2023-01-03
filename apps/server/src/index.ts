import mysql from 'mysql2';

const pool = mysql
	.createPool({
		host: 'localhost',
		user: 'root',
		password: 'root',
		database: 'social'
	})
	.promise();

const test = async () => {
	const result = await pool.query('SELECT * FROM User;');
	console.log(result[0]);
};

test().then(() => console.log('test successful!'));

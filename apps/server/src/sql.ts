import mysql from 'mysql2';
import Query from './mysql/queries';

const pool = mysql
	.createPool({
		host: 'localhost',
		user: 'root',
		password: 'root',
		database: 'social',
		connectionLimit: 10,
		queueLimit: 0,
		waitForConnections: true
	})
	.promise();

export const executeSQL = async (query: string) => {
	const connection = await pool.getConnection();
	try {
		connection.beginTransaction();
		const [result] = await connection.query(query);
		connection.commit();
		return result;
	} catch (error) {
		connection.rollback();
		console.error('mysql error:', error);
		throw error;
	} finally {
		connection.release();
	}
};

const test = async () => {
	const result = await executeSQL(Query.test);
	console.log(result);
};

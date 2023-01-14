import express, { Request, Response } from 'express';
import { RowDataPacket } from 'mysql2';
import { Chats, Likes, Posts, User } from './index.d';
import queries from './mysql/queries';
import { executeSQL } from './sql';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());

app.listen(4000, () => {
	console.log('Server is up on port 4000');
});

app.get('/', (req: Request, res: Response) => {
	console.log('hi');
	res.send({ data: 'hi', error: true });
});

app.post('/login', async (req: Request<unknown, unknown, User>, res: Response) => {
	const data = req.body;

	if (!data.username || !data.password)
		return res.send({ login: false, msg: 'Username or Password missing!' });

	const result = (await executeSQL(queries.users.selectOne(data.username))) as RowDataPacket[];
	if (result[0]) {
		if (result[0].password == data.password) {
			console.log(`Logged in User ${data.username}`);
			return res.status(StatusCodes.OK).send({ login: true, msg: 'Login Successful!' });
		}
		return res.send({ login: false, msg: 'Incorrect Password!' });
	}

	// if (!data.fullname || !data.gender)
	// 	return res.send({data:'Missing Profile Information!',error:true});

	try {
		const result = await executeSQL(queries.users.insert(data));
		console.log(`Logged in User ${data.username}`);
		return res.status(201).send({ login: true, msg: 'Login Successful!' });
	} catch (e) {
		console.error(e);
		return res.send({ login: false, msg: 'Login Failed!' });
	}
});

app.get('/post', async (req: Request<unknown, unknown, Posts>, res: Response) => {
	try {
		const result = await executeSQL(queries.posts.selectAllwithLikes());
		return res.status(201).send({ data: result, error: false });
	} catch (e) {
		console.error(e);
		return res.send({ data: 'Post Failed!', error: true });
	}
});

app.post('/post', async (req: Request<unknown, unknown, Posts>, res: Response) => {
	const data = req.body;
	if (!data.username_fk || !data.contents)
		return res.send({ data: 'Username or Contents missing!', error: true });

	try {
		await executeSQL(queries.posts.insert(data.username_fk, data.contents));
		const result = await executeSQL(queries.posts.selectAllwithLikes());
		return res.status(201).send({ data: result, error: false });
	} catch (e) {
		console.error(e);
		return res.send({ data: 'Post Failed!', error: true });
	}
});
app.delete(
	'/post',
	async (req: Request<unknown, unknown, unknown, { post_id: number }>, res: Response) => {
		const data = req.query;
		if (!data.post_id) return res.send({ data: 'Post ID missing!', error: true });
		try {
			await executeSQL(queries.posts.deleteOne(data.post_id));
			const result = await executeSQL(queries.posts.selectAllwithLikes());
			return res.status(201).send({ data: result, error: false });
		} catch (e) {
			console.error(e);
			return res.send(`Post ${data.post_id} Deletion Failed!`);
		}
	}
);

app.get('/like/:postid', async (req: Request, res: Response) => {
	const { postid } = req.params;
	try {
		const result = await executeSQL(queries.likes.selectAllByPost(parseInt(postid)));
		return res.status(201).send({ data: result, error: false });
	} catch (e) {
		console.error(e);
		return res.send({ data: 'Something Wen Wrong!', error: true });
	}
});

app.post('/like', async (req: Request<unknown, unknown, unknown, Likes>, res: Response) => {
	const data = req.query;
	if (!data.post_id_fk || !data.username_fk)
		return res.send({ data: 'Username or Post Id missing!', error: true });

	try {
		await executeSQL(queries.likes.insert(data.post_id_fk, data.username_fk));
		const result = await executeSQL(queries.posts.selectAllwithLikes());
		return res.status(201).send({ data: result, error: false });
	} catch (e) {
		console.error(e);
		return res.send({ data: 'Like Failed!', error: true });
	}
});

app.delete('/like', async (req: Request<unknown, unknown, unknown, Likes>, res: Response) => {
	const data = req.query;
	if (!data.post_id_fk || !data.username_fk)
		return res.send({ data: 'Username or Post Id missing!', error: true });

	try {
		await executeSQL(queries.likes.delete(data.post_id_fk, data.username_fk));
		const result = await executeSQL(queries.posts.selectAllwithLikes());
		return res.status(201).send({ data: result, error: false });
	} catch (e) {
		console.error(e);
		return res.send({ data: 'Like Removal Failed!', error: true });
	}
});

app.get('/existslike', async (req: Request<unknown, unknown, unknown, Likes>, res: Response) => {
	const data = req.query;
	if (!data.post_id_fk || !data.username_fk)
		return res.send({ data: 'Username or Post Id missing!', error: true });

	try {
		const result = (await executeSQL(
			queries.likes.existsWithPostAndUSername(data.post_id_fk, data.username_fk)
		)) as RowDataPacket[];
		if (!result.length) return res.status(201).send({ data: false });
		return res.status(201).send({ data: true });
	} catch (e) {
		console.error(e);
		return res.send({ data: 'Something Went Wrong!', error: true });
	}
});

app.get(
	'/chat',
	async (
		req: Request<unknown, unknown, unknown, { user1: string; user2: string }>,
		res: Response
	) => {
		try {
			const result = await executeSQL(
				queries.chats.selectChatsBetween(req.query.user1, req.query.user2)
			);
			return res.status(201).send({ data: result, error: false });
		} catch (e) {
			console.error(e);
			return res.send({ data: 'Something Went Wrong!', error: true });
		}
	}
);

app.post('/chat', async (req: Request<unknown, unknown, Chats>, res: Response) => {
	const data = req.body;
	if (!data.s_username_fk || !data.r_username_fk || !data.contents)
		return res.send({ data: 'Username or Contents missing!', error: true });

	try {
		await executeSQL(
			queries.chats.insert(data.s_username_fk, data.r_username_fk, data.contents)
		);
		const result = await executeSQL(
			queries.chats.selectChatsBetween(data.s_username_fk, data.r_username_fk)
		);
		return res.status(201).send({ data: result, error: false });
	} catch (e) {
		console.error(e);
		return res.send({ data: 'Send Failed!', error: true });
	}
});

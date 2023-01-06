import { User } from '../index.d';
import { escape as e } from 'mysql2';

const test = `
    SELECT * FROM users;
`;

const users = {
	selectOne: (username: string) => `
        SELECT password FROM users 
        WHERE username=${e(username)}; 
    `,

	insert: (user: User) => `
        INSERT INTO users 
        (
	        username,
	        fullname,
	        gender,
	        password
        )
        VALUES (
            ${e(user.username)},
            ${e(user.fullname)},
            ${e(user.gender)},
            ${e(user.password)}
        );
    `
};

const posts = {
	insert: (username: string, contents: string) => `
        INSERT INTO posts
        (username_fk, contents)
        VALUES (${e(username)}, ${e(contents)});
    `,
	selectAll: () => `
        SELECT * FROM posts;
    `,
	selectByUser: (username: string) => `
        SELECT * FROM posts WHERE username_fk=${e(username)}
    `,
	deleteOne: (post_id: string) => `
        DELETE FROM posts WHERE post_id=${e(post_id)};
    `,
	selectAllwithLikes: () => `
        SELECT post_id, username_fk, contents, created_at,count
        FROM posts 
        LEFT JOIN (
            SELECT COUNT(*) as count, post_id_fk 
            FROM likes GROUP BY post_id_fk
        ) T
        ON posts.post_id=T.post_id_fk;
    `
};

const likes = {
	insert: (post_id: number, username: string) => `
        INSERT INTO likes
        (post_id_fk, username_fk)
        VALUES (${e(post_id)}, ${e(username)});
    `,
	selectUserNamesByPost: (post_id: string) => `
        SELECT username FROM posts WHERE post_id_fk=${e(post_id)};
    `
};

export default { test, users, posts, likes };

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
	deleteOne: (post_id: number) => `
        DELETE FROM posts WHERE post_id=${e(post_id)};
    `,
	selectAllwithLikes: () => `
        SELECT post_id, username_fk, contents, created_at, count
        FROM posts 
        LEFT JOIN (
            SELECT COUNT(*) as count, post_id_fk 
            FROM likes GROUP BY post_id_fk
        ) T
        ON posts.post_id=T.post_id_fk
        ORDER BY posts.created_at DESC;
    `
};

const likes = {
	existsWithPostAndUSername: (post_id: number, username: string) => `
        SELECT username_fk FROM likes
        WHERE post_id_fk=${e(post_id)} AND username_fk=${e(username)};
    `,
	selectAllByPost: (post_id: number) => `
        SELECT username_fk FROM likes
        WHERE post_id_fk=${e(post_id)};
    `,
	insert: (post_id: number, username: string) => `
        INSERT INTO likes
        (post_id_fk, username_fk)
        VALUES (${e(post_id)}, ${e(username)});
    `,
	delete: (post_id: number, username: string) => `
        DELETE FROM likes
        WHERE post_id_fk=${e(post_id)} and username_fk=${e(username)}
    `
};

const chats = {
	selectChatsBetween: (user1: string, user2: string) => `
        SELECT * FROM chats
        WHERE s_username_fk=${e(user1)} AND r_username_fk=${e(user2)}
        OR s_username_fk=${e(user2)} AND r_username_fk=${e(user1)}
        ORDER BY created_at DESC;
    `,
	insert: (s_username: string, r_username: string, contents: string) => `
        INSERT INTO chats
        (s_username_fk, r_username_fk, contents)
        VALUES (${e(s_username)}, ${e(r_username)}, ${e(contents)});
    `
};

export default { test, users, posts, likes, chats };

export interface User {
	username: string;
	fullname: string;
	gender: 'male' | 'female' | 'other';
	bio: string;
	profile_photo_url: string;
	password: string;
}

export interface Posts {
	post_id: number;
	username_fk: string;
	contents: string;
	created_at: string;
}

export interface Likes {
	post_id_fk: number;
	username_fk: string;
}

export interface Comments {
	comment_id: number;
	contents: string;
	created_at: string;
	post_id_fk: number;
	username_fk: string;
}

export interface Chats {
	user1_name_fk: string;
	user2_name_fk: string;
	created_at: string;
	contents: string;
}

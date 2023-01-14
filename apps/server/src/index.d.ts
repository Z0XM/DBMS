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

export interface Chats {
	s_username_fk: string;
	r_username_fk: string;
	created_at: string;
	contents: string;
}

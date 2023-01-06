DROP DATABASE IF EXISTS social;

CREATE DATABASE social;
USE social;

CREATE TABLE users (
    username varchar(10) primary key ,
    fullname varchar(255),
    gender varchar(255),
    bio text,
    password text not null
);

CREATE TABLE posts(
    post_id integer primary key auto_increment,
    username_fk varchar(10),
    contents text,
    created_at timestamp default current_timestamp on update current_timestamp,
    foreign key(username_fk) references users (username)
);

CREATE TABLE likes(
    post_id_fk integer,
    username_fk varchar(10),
    foreign key(post_id_fk) references posts (post_id),
    foreign key(username_fk) references users (username) 
);

CREATE TABLE comments (
    comment_id integer primary key auto_increment,
    contents text,
    created_at timestamp default current_timestamp on update current_timestamp,
    post_id_fk integer,
    username_fk varchar(10),
    foreign key (post_id_fk) references posts (post_id),
    foreign key (username_fk) references users (username)
);

CREATE TABLE Chats(
    user1_name_fk varchar(10),
    user2_name_fk varchar(10),
    created_at timestamp default current_timestamp on update current_timestamp,
    contents text,
    foreign key (user1_name_fk) references users (username),
    foreign key (user2_name_fk) references users (username)
);

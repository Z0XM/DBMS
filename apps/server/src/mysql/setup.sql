DROP DATABASE IF EXISTS social;

CREATE DATABASE social;
USE social;

CREATE TABLE users (
    username varchar(10) primary key ,
    password text not null
);

CREATE TABLE posts(
    post_id integer primary key auto_increment,
    username_fk varchar(10),
    contents text,
    created_at timestamp default current_timestamp on update current_timestamp,
    foreign key(username_fk) references users (username) on delete cascade
);

CREATE TABLE likes(
    post_id_fk integer,
    username_fk varchar(10),
    foreign key(post_id_fk) references posts (post_id) on delete cascade,
    foreign key(username_fk) references users (username) on delete cascade,
    constraint unique_pair unique (post_id_fk, username_fk)
);

CREATE TABLE Chats(
    s_username_fk varchar(10),
    r_username_fk varchar(10),
    created_at timestamp default current_timestamp on update current_timestamp,
    contents text,
    foreign key (s_username_fk) references users (username) on delete cascade,
    foreign key (r_username_fk) references users (username) on delete cascade
);

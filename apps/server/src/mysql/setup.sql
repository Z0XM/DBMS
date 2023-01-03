CREATE DATABASE social;

USE social;

CREATE TABLE User (
	id integer primary key auto_increment,
    user_name varchar(10) unique not null,
    full_name varchar(255) not null,
    bio text,
    profile_photo_url text,
    enc_pass text not null
);

INSERT INTO User (user_name, full_name, enc_pass) 
values ('z0xm', 'mukul singh', '000');

create table users (
	id serial primary key,
	email varchar(255) not null,
	password varchar(255) not null
);

create table category (
	id serial primary key,
	title varchar(255) not null
);

create table task (
	id serial primary key,
	title varchar(255) not null,
	date DATE not null,
	time time,
	description text,
	category_id int references category(id) on delete cascade,
	user_id int references users(id) on delete cascade
);
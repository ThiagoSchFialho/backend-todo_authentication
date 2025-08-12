create table "user" (
	id serial primary key,
	email varchar(255) not null,
	password varchar(255) not null
);

create table task (
	id serial primary key,
	title varchar(255) not null,
	date DATE not null,
	time time,
	description text,
	category varchar(255),
	user_id int references "user"(id) on delete cascade
);
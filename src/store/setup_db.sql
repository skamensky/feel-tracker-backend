CREATE TABLE tag(
    tag_id INTEGER PRIMARY KEY,
    name TEXT
);

CREATE TABLE user(
    user_id INTEGER PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    google_id TEXT
);

CREATE TABLE activity(
    activity_id INTEGER PRIMARY KEY,
    user_id INTEGER,
    title TEXT,
    description TEXT,
    feeling TEXT,
    time INTEGER,
    FOREIGN KEY(user_id) REFERENCES user(user_id)
);

CREATE TABLE activity_tag_junction(
    junction_id INTEGER PRIMARY KEY,
    tag_id INTEGER,
    activity_id INTEGER,
    FOREIGN KEY(tag_id) REFERENCES tag(tag_id),
    FOREIGN KEY(activity_id) REFERENCES activity(activity_id)
);

insert into user (
    first_name,
    last_name,
    email,
    google_id
) VALUES ('shmuel','kamensky','example@example.com','123');
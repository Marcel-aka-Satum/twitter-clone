# Models

This file defines the database models for the application.

## Tables

There are three association tables defined:

- `user_posts`: This table represents the many-to-many relationship between users and posts. Each row in this table represents a user creating a post.
- `user_likes`: This table represents the many-to-many relationship between users and posts. Each row in this table represents a user liking a post.
- `user_follows`: This table represents the many-to-many relationship between users. Each row in this table represents a user following another user.

## User Model

The `User` model represents a user in the application. It has the following fields:

- `id`: The primary key of the user.
- `nickname`: The nickname of the user.
- `username`: The username of the user. This field is unique and indexed for faster lookups.
- `email`: The email of the user. This field is unique and indexed for faster lookups.
- `hashed_password`: The hashed password of the user.
- `avatar`: The avatar of the user.
- `banner`: The banner of the user.
- `is_active`: A boolean field that indicates whether the user is active.
- `description`: The description of the user.
- `created_on`: The date and time when the user was created. This field is automatically set to the current date and time when a user is created.

The `User` model also has two relationships:

- `followers`: This is a many-to-many relationship with the `User` model itself. It represents the users that are followed by the user.
- `followed_by`: This is a many-to-many relationship with the `User` model itself. It represents the users that are following the user.

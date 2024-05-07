# Models

This file defines the database models for the application.

## Post Model

The `Post` model represents a post in the application. It has the following fields:

- `id`: The primary key of the post. This field is automatically incremented for each new post.
- `message`: The message of the post. This is a string of up to 300 characters.
- `created_on`: The date and time when the post was created. This field is automatically set to the current date and time when a post is created.
- `scheduled_for`: The date and time when the post is scheduled to be published. This field is nullable, which means a post doesn't have to be scheduled.
- `owner_id`: The ID of the user who created the post. This is a foreign key that references the `id` field in the `User` model.
- `files`: An array of strings that represent the files associated with the post.
- `user`: This is a relationship with the `User` model. It represents the user who created the post.
- `published`: A boolean field that indicates whether the post is published. By default, a post is published when it's created.
- `parent_id`: The ID of the post that this post is a comment on. This is a foreign key that references the `id` field in the `Post` model itself. This field is used to implement comments as posts.
- `comments`: This is a self-referential relationship with the `Post` model itself. It represents the comments on the post.

The `Post` model uses the `backref` option in the `relationship` function to create a bidirectional relationship. This means you can access the parent of a comment with `comment.parent` and the comments of a post with `post.comments`.

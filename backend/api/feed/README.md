# Models

This file defines the database models for the application.

## Feed Model

The `Feed` model represents a feed in the application. A feed is a collection of posts that are displayed to the user. For example, on the home page, you might have a global feed where all new posts are shown.

The `Feed` model has the following fields:

- `id`: The primary key of the feed. This field is automatically incremented for each new feed.
- `type`: The type of the feed. This is a string of up to 50 characters.

The `Feed` model also has a relationship:

- `posts`: This is a many-to-many relationship with the `Post` model. It represents the posts that are included in the feed. The relationship is implemented using the `posts_feed` association table.

The `posts_feed` association table has two columns:

- `feed_id`: This is a foreign key that references the `id` field in the `Feed` model.
- `post_id`: This is a foreign key that references the `id` field in the `Post` model.

Each row in the `posts_feed` table represents a post being included in a feed.

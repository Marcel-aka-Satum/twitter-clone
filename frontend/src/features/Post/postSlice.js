import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const postSlice = createSlice({
  name: "post",
  initialState: {
    post: [],
    posts: [],
    comments: [],
    error: null,
    postNotFound: null,
    commentsNotFound: null,
    scheduled: false,
    scheduledError: false,
    likes: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.post = action.payload;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.postNotFound = action.error.message;
      });
    builder
      .addCase(fetchCommentsByPostId.fulfilled, (state, action) => {
        state.comments = action.payload.posts;
      })
      .addCase(fetchCommentsByPostId.rejected, (state, action) => {
        state.commentsNotFound = action.error.message;
      });

    builder
      .addCase(createComment.fulfilled, (state, action) => {
        state.post = {
          ...state.post,
          amountOfComments: state.post.amountOfComments + 1,
        };
        state.comments = [...state.comments, action.payload];
      })
      .addCase(createComment.rejected, (state, action) => {
        state.error = action.error.message;
      });

    builder
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.post = {
          ...state.post,
          amountOfComments: state.post.amountOfComments - 1,
        };
        state.comments = state.comments.filter(
          (comment) => comment.id !== action.payload
        );
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.error = action.error.message;
      });

    builder
      .addCase(deleteUserStatusPost.fulfilled, (state, action) => {
        state.post = [];
        state.postNotFound = true;
      })
      .addCase(deleteUserStatusPost.rejected, (state, action) => {
        state.error = action.error.message;
      });

    builder
      .addCase(createPost.fulfilled, (state, action) => {
        if (action.payload.published == true) {
          state.posts = [...state.posts, action.payload];
          state.scheduled = false;
        } else {
          state.scheduled = true;
        }
      })
      .addCase(createPost.rejected, (state, action) => {
        state.error = action.error.message;
        state.scheduledError = true;
      });
    builder
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.posts = action.payload.posts;
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
        state.error = action.error.message;
      });
    builder
      .addCase(fetchUserPostsByUsername.fulfilled, (state, action) => {
        state.posts = action.payload.posts;
      })
      .addCase(fetchUserPostsByUsername.rejected, (state, action) => {
        state.error = "User not found";
      });
    builder
      .addCase(deleteUserPost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((post) => post.id !== action.payload);
      })
      .addCase(deleteUserPost.rejected, (state, action) => {
        state.error = action.error.message;
      });

    builder
      .addCase(likePost.fulfilled, (state, action) => {
        if (state.post.id === action.payload.id) {
          state.post = action.payload;
        }
        state.comments = state.comments.map((comment) => {
          if (comment.id === action.payload.id) {
            return {
              ...comment,
              amountOfLikes: action.payload.amountOfLikes,
            };
          }
          return comment;
        });
        state.posts = state.posts.map((post) => {
          if (post.id === action.payload.id) {
            return {
              ...post,
              amountOfLikes: action.payload.amountOfLikes,
            };
          }
          return post;
        });
      })
      .addCase(likePost.rejected, (state, action) => {
        state.error = action.error.message;
      });

    builder
      .addCase(repostPost.fulfilled, (state, action) => {
        if (state.post.id === action.payload.id) {
          state.post = action.payload;
        }
        state.comments = state.comments.map((comment) => {
          if (comment.id === action.payload.id) {
            return {
              ...comment,
              amountOfReposts: action.payload.amountOfReposts,
            };
          }
          return comment;
        });
        state.posts = state.posts.map((post) => {
          if (post.id === action.payload.id) {
            return {
              ...post,
              amountOfReposts: action.payload.amountOfReposts,
            };
          }
          return post;
        });
        state.reposted = true;
      })
      .addCase(repostPost.rejected, (state, action) => {
        state.error = action.error.message;
        state.reposted = false;
      });
    builder
      .addCase(fetchUserCommentByUsername.fulfilled, (state, action) => {
        console.log(action.payload);
        state.comments = action.payload;
      })
      .addCase(fetchUserCommentByUsername.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export const createPost = createAsyncThunk("user/createPost", async (data) => {
  const response = await fetch("http://localhost:8000/api/v1/post", {
    method: "POST",
    credentials: "include",
    body: data,
  });
  const payloadData = await response.json();
  return payloadData;
});

export const fetchUserPosts = createAsyncThunk(
  "user/fetchUserPosts",
  async (user_id) => {
    const response = await fetch(
      `http://localhost:8000/api/v1/user/post/${user_id}`
    );
    const data = await response.json();
    return data;
  }
);

export const repostPost = createAsyncThunk(
  "user/repostPost",
  async ({ post_id }) => {
    const response = await fetch(
      `http://localhost:8000/api/v1/repost/${post_id}`,
      {
        method: "PATCH",
        credentials: "include",
      }
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return data;
  }
);

export const fetchUserCommentByUsername = createAsyncThunk(
  "user/fetchUserCommentByUsername",
  async (username) => {
    const response = await fetch(
      `http://localhost:8000/api/v1/user/comments/${username}`
    );
    const data = await response.json();
    return data;
  }
);

export const likePost = createAsyncThunk("user/likePost", async (post_id) => {
  const response = await fetch(`http://localhost:8000/api/v1/like/${post_id}`, {
    method: "PATCH",
    credentials: "include",
  });
  const data = await response.json();
  return data;
});

export const fetchPostById = createAsyncThunk(
  "post/fetchPostById",
  async (post_id) => {
    const response = await fetch(
      `http://localhost:8000/api/v1/post/${post_id}`
    );
    const data = await response.json();
    if (response.status === 404) throw new Error("Post not found");
    return data;
  }
);

export const fetchCommentsByPostId = createAsyncThunk(
  "post/fetchCommentsByPostId",
  async (post_id) => {
    const response = await fetch(
      `http://localhost:8000/api/v1/comments/post/${post_id}`
    );
    const data = await response.json();
    if (response.status === 404) throw new Error("Post not found");
    return data;
  }
);

export const fetchUserPostsByUsername = createAsyncThunk(
  "user/fetchUserPostsByUsername",
  async (username) => {
    const response = await fetch(
      `http://localhost:8000/api/v1/user/post/username/${username}`
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return data;
  }
);

export const deleteUserPost = createAsyncThunk(
  "user/deleteUserPost",
  async (post_id) => {
    const response = await fetch(
      `http://localhost:8000/api/v1/post/${post_id}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return post_id;
  }
);

export const createComment = createAsyncThunk(
  "user/createComment",
  async (data) => {
    const response = await fetch("http://localhost:8000/api/v1/comment", {
      method: "POST",
      credentials: "include",
      body: data,
    });
    const payloadData = await response.json();
    return payloadData;
  }
);

export const deleteComment = createAsyncThunk(
  "user/deleteComment",
  async (post_id) => {
    const response = await fetch(
      `http://localhost:8000/api/v1/post/${post_id}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 404) throw new Error("Post not found");
    return post_id;
  }
);

export const deleteUserStatusPost = createAsyncThunk(
  "user/deleteUserStatusPost",
  async (post_id) => {
    const response = await fetch(
      `http://localhost:8000/api/v1/post/${post_id}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return post_id;
  }
);

export default postSlice.reducer;

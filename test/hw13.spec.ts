import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { appSetup } from '../src/setup/app.setup';
import { PaginatedResult } from '../src/core/infrastructure/pagination';
import { BlogView } from '../src/modules/bloggers-platform/blogs/domain/models/blog-view.interface';

describe('Homework 13', () => {
  let app: INestApplication;
  let server: any;
  let createdBlogId: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    appSetup(app);
    await app.init();
    server = app.getHttpServer();

    // Clear all test data
    await request(server).delete('/testing/all-data').expect(204);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Blogs without auth and validation', () => {
    it('POST -> "/blogs": should create new blog; status 201; content: created blog;  used additional methods: GET -> /blogs/:id;', async () => {
      const newBlog = {
        name: 'Test Blog',
        description: 'This is a test blog',
        websiteUrl: 'https://example.com/blog'
      };

      // Create blog
      const createResponse = await request(server)
        .post('/blogs')
        .send(newBlog)
        .expect(201);

      const createdBlog = createResponse.body;
      createdBlogId = createdBlog.id;

      // Verify created blog has all expected fields
      expect(createdBlog).toEqual({
        id: expect.any(String),
        name: newBlog.name,
        description: newBlog.description,
        websiteUrl: newBlog.websiteUrl,
        createdAt: expect.stringMatching(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/),
        isMembership: false
      });

      // Verify blog can be retrieved
      const getResponse = await request(server)
        .get(`/blogs/${createdBlogId}`)
        .expect(200);

      expect(getResponse.body).toEqual(createdBlog);
    });

    it('POST -> "/blogs/:blogId/posts": should create new post for specific blog; status 201; content: created post;  used additional methods: POST -> /blogs, GET -> /posts/:id;', async () => {
      // Create a blog first
      const newBlog = {
        name: 'Blog for Posts',
        description: 'This blog will have posts',
        websiteUrl: 'https://example.com/blog-posts'
      };

      const blogResponse = await request(server)
        .post('/blogs')
        .send(newBlog)
        .expect(201);

      const blogId = blogResponse.body.id;

      // Create a post for this blog
      const newPost = {
        title: 'Test Post',
        shortDescription: 'This is a test post',
        content: 'Post content goes here'
      };

      const postResponse = await request(server)
        .post(`/blogs/${blogId}/posts`)
        .send(newPost)
        .expect(201);

      const createdPost = postResponse.body;
      
      // Verify created post has correct structure
      expect(createdPost).toEqual({
        id: expect.any(String),
        title: newPost.title,
        shortDescription: newPost.shortDescription,
        content: newPost.content,
        blogId: blogId,
        blogName: newBlog.name,
        createdAt: expect.any(String)
      });

      // Verify post can be retrieved
      const getPostResponse = await request(server)
        .get(`/posts/${createdPost.id}`)
        .expect(200);

      expect(getPostResponse.body).toEqual(createdPost);
    });

    it('GET -> "/blogs/:blogId/posts": should return status 200; content: posts for specific blog with pagination;  used additional methods: POST -> /blogs, POST -> /posts;', async () => {
      // Create a blog first
      const newBlog = {
        name: 'Blog with Many',
        description: 'This blog will have multiple posts',
        websiteUrl: 'https://example.com/many-posts'
      };

      const blogResponse = await request(server)
        .post('/blogs')
        .send(newBlog)
        .expect(201);

      const blogId = blogResponse.body.id;

      // Create multiple posts for this blog
      const posts: any[] = [];
      for (let i = 1; i <= 5; i++) {
        const postData = {
          title: `Post ${i}`,
          shortDescription: `Description ${i}`,
          content: `Content ${i}`
        };

        const postResponse = await request(server)
          .post(`/blogs/${blogId}/posts`)
          .send(postData)
          .expect(201);

        posts.push(postResponse.body);
      }

      // Get all posts for blog with pagination
      const getPostsResponse = await request(server)
        .get(`/blogs/${blogId}/posts?pageNumber=1&pageSize=3`)
        .expect(200);

      const result = getPostsResponse.body;

      // Verify pagination structure
      expect(result).toEqual({
        items: expect.any(Array),
        totalCount: 5,
        page: 1,
        pageSize: 3
      });

      // Verify first page has 3 items
      expect(result.items.length).toBe(3);

      // Verify each post has correct structure
      result.items.forEach(post => {
        expect(post).toEqual({
          id: expect.any(String),
          title: expect.any(String),
          shortDescription: expect.any(String),
          content: expect.any(String),
          blogId,
          blogName: newBlog.name,
          createdAt: expect.any(String)
        });
      });
    });

    it('GET -> "blogs": should return status 200; content: blog array with pagination;  used additional methods: POST -> /blogs, GET -> /blogs;', async () => {
      // Create multiple blogs
      const blogs: any[] = [];
      for (let i = 0; i < 12; i++) {
        const blogData = {
          name: `Blog ${i}`,
          description: 'description',
          websiteUrl: 'https://someurl.com'
        };

        const response = await request(server)
          .post('/blogs')
          .send(blogData)
          .expect(201);

        blogs.push(response.body);
      }

      // Get all blogs with pagination
      const getBlogsResponse = await request(server)
        .get('/blogs')
        .expect(200);

      const result = getBlogsResponse.body;

      // Verify pagination structure
      expect(result).toEqual({
        items: expect.any(Array),
        totalCount: expect.any(Number),
        page: expect.any(Number),
        pageSize: expect.any(Number)
      });

      // Verify blog structure in response
      result.items.forEach(blog => {
        expect(blog).toEqual({
          id: expect.any(String),
          name: expect.any(String),
          description: expect.any(String),
          websiteUrl: expect.any(String),
          createdAt: expect.stringMatching(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/),
          isMembership: expect.any(Boolean)
        });
      });
    });

    it('GET -> "blogs/:id": should return status 200; content: blog by id;  used additional methods: POST -> /blogs;', async () => {
      // Create a blog
      const newBlog = {
        name: 'Get By ID Blog',
        description: 'Blog to test get by ID',
        websiteUrl: 'https://example.com/blog-id'
      };

      const createResponse = await request(server)
        .post('/blogs')
        .send(newBlog)
        .expect(201);

      const createdBlog = createResponse.body;

      // Get blog by ID
      const getBlogResponse = await request(server)
        .get(`/blogs/${createdBlog.id}`)
        .expect(200);

      // Verify blog has correct structure
      expect(getBlogResponse.body).toEqual({
        id: createdBlog.id,
        name: newBlog.name,
        description: newBlog.description,
        websiteUrl: newBlog.websiteUrl,
        createdAt: expect.stringMatching(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/),
        isMembership: false
      });
    });
  });

  describe('Posts without auth and validation', () => {
    let blogId: string;

    beforeAll(async () => {
      // Create a blog to use for posts
      const newBlog = {
        name: 'Blog for Posts',
        description: 'This blog will have posts',
        websiteUrl: 'https://example.com/blog-posts'
      };

      const blogResponse = await request(server)
        .post('/blogs')
        .send(newBlog)
        .expect(201);

      blogId = blogResponse.body.id;
    });

    it('POST -> "/posts": should create new post for an existing blog; status 201; content: created post;  used additional methods: POST -> /blogs, GET -> /posts/:id;', async () => {
      // Create a post
      const newPost = {
        title: 'Post Title',
        shortDescription: 'Post short description',
        content: 'Post content',
        blogId: blogId
      };

      const createResponse = await request(server)
        .post('/posts')
        .send(newPost)
        .expect(201);

      const createdPost = createResponse.body;

      // Verify post has correct structure
      expect(createdPost).toEqual({
        id: expect.any(String),
        title: newPost.title,
        shortDescription: newPost.shortDescription,
        content: newPost.content,
        blogId: blogId,
        blogName: expect.any(String),
        createdAt: expect.any(String)
      });

      // Verify post can be retrieved by ID
      const getPostResponse = await request(server)
        .get(`/posts/${createdPost.id}`)
        .expect(200);

      expect(getPostResponse.body).toEqual(createdPost);
    });

    it('GET -> "/posts/:id": should return status 200; content: post by id;  used additional methods: POST -> /blogs, POST -> /posts;', async () => {
      // Create a post
      const newPost = {
        title: 'Get by ID Post',
        shortDescription: 'Post to test get by ID',
        content: 'Post content here',
        blogId: blogId
      };

      const createResponse = await request(server)
        .post('/posts')
        .send(newPost)
        .expect(201);

      const createdPost = createResponse.body;

      // Get post by ID
      const getPostResponse = await request(server)
        .get(`/posts/${createdPost.id}`)
        .expect(200);

      // Verify post has correct structure
      expect(getPostResponse.body).toEqual(createdPost);
    });

    it('PUT -> "/posts/:id": should update post by id; status 204;  used additional methods: POST -> /blogs, POST -> /posts, GET -> /posts/:id;', async () => {
      // Create a post
      const newPost = {
        title: 'Post to Update',
        shortDescription: 'This post will be updated',
        content: 'Original content',
        blogId: blogId
      };

      const createResponse = await request(server)
        .post('/posts')
        .send(newPost)
        .expect(201);

      const createdPost = createResponse.body;

      // Update the post
      const updatedData = {
        title: 'Updated Post Title',
        shortDescription: 'Updated description',
        content: 'Updated content',
        blogId: blogId
      };

      await request(server)
        .put(`/posts/${createdPost.id}`)
        .send(updatedData)
        .expect(204);

      // Verify post was updated
      const getUpdatedPost = await request(server)
        .get(`/posts/${createdPost.id}`)
        .expect(200);

      expect(getUpdatedPost.body).toEqual({
        id: createdPost.id,
        title: updatedData.title,
        shortDescription: updatedData.shortDescription,
        content: updatedData.content,
        blogId: blogId,
        blogName: expect.any(String),
        createdAt: createdPost.createdAt
      });
    });

    it('DELETE -> "/posts/:id": should delete post by id; status 204;  used additional methods: POST -> /blogs, POST -> /posts, GET -> /posts/:id;', async () => {
      // Create a post
      const newPost = {
        title: 'Post to Delete',
        shortDescription: 'This post will be deleted',
        content: 'Content to delete',
        blogId: blogId
      };

      const createResponse = await request(server)
        .post('/posts')
        .send(newPost)
        .expect(201);

      const createdPost = createResponse.body;

      // Delete the post
      await request(server)
        .delete(`/posts/${createdPost.id}`)
        .expect(204);

      // Verify post was deleted
      await request(server)
        .get(`/posts/${createdPost.id}`)
        .expect(404);
    });

    it('GET -> "/posts": should return status 200; content: posts array with pagination;  used additional methods: POST -> /blogs, POST -> /posts;', async () => {
      // Create multiple posts
      const posts: any[] = [];
      for (let i = 1; i <= 5; i++) {
        const postData = {
          title: `Pagination Post ${i}`,
          shortDescription: `Description ${i}`,
          content: `Content ${i}`,
          blogId: blogId
        };

        const postResponse = await request(server)
          .post('/posts')
          .send(postData)
          .expect(201);

        posts.push(postResponse.body);
      }

      // Get all posts with pagination
      const getPostsResponse = await request(server)
        .get('/posts?pageNumber=1&pageSize=3')
        .expect(200);

      const result = getPostsResponse.body;

      // Verify pagination structure
      expect(result).toEqual({
        items: expect.any(Array),
        totalCount: expect.any(Number),
        page: 1,
        pageSize: 3
      });

      // Verify first page has correct number of items
      expect(result.items.length).toBeLessThanOrEqual(3);

      // Verify post structure
      result.items.forEach(post => {
        expect(post).toEqual({
          id: expect.any(String),
          title: expect.any(String),
          shortDescription: expect.any(String),
          content: expect.any(String),
          blogId: expect.any(String),
          blogName: expect.any(String),
          createdAt: expect.any(String)
        });
      });
    });
  });

  describe('Users without auth and validation', () => {
    it('POST -> "/users": should create new user; status 201; content: created user;  used additional methods: GET => /users;', async () => {
      // Create a user
      const newUser = {
        login: 'testuser',
        password: 'password123',
        email: 'test@example.com'
      };

      const createResponse = await request(server)
        .post('/users')
        .send(newUser)
        .expect(201);

      const createdUser = createResponse.body;

      // Verify user has correct structure
      expect(createdUser).toEqual({
        id: expect.any(String),
        login: newUser.login,
        email: newUser.email,
        createdAt: expect.any(String)
      });

      // Verify user is in the users list
      const getUsersResponse = await request(server)
        .get('/users?pageSize=50')
        .expect(200);

      const users = getUsersResponse.body.items;
      const foundUser = users.find(u => u.id === createdUser.id);
      
      expect(foundUser).toEqual(createdUser);
    });

    it('GET -> "/users": should return status 200; content: users array with pagination;  used additional methods: POST -> /users;', async () => {
      // Create multiple users
      const users: any[] = [];
      for (let i = 1; i <= 5; i++) {
        const userData = {
          login: `user${i}`,
          password: 'qwerty1',
          email: `email${i}@gg.cm`
        };

        const userResponse = await request(server)
          .post('/users')
          .send(userData)
          .expect(201);

        users.push(userResponse.body);
      }

      // Get all users with pagination
      const getUsersResponse = await request(server)
        .get('/users?pageNumber=1&pageSize=3')
        .expect(200);

      const result = getUsersResponse.body;

      // Verify pagination structure
      expect(result).toEqual({
        items: expect.any(Array),
        totalCount: expect.any(Number),
        page: 1,
        pageSize: 3
      });

      // Verify first page has correct number of items
      expect(result.items.length).toBeLessThanOrEqual(3);

      // Verify user structure
      result.items.forEach(user => {
        expect(user).toEqual({
          id: expect.any(String),
          login: expect.any(String),
          email: expect.any(String),
          createdAt: expect.any(String)
        });
        // Password should not be returned
        expect(user).not.toHaveProperty('password');
      });
    });

    it('DELETE -> "/users/:id": should delete user by id; status 204;  used additional methods: POST -> /users, GET -> /users;', async () => {
      // Create a user
      const newUser = {
        login: `lg-${Math.floor(Math.random() * 1000000)}`,
        password: 'qwerty1',
        email: `email${Math.floor(Math.random() * 1000000)}@gg.com`
      };

      const createResponse = await request(server)
        .post('/users')
        .send(newUser)
        .expect(201);

      const createdUser = createResponse.body;

      // Delete the user
      await request(server)
        .delete(`/users/${createdUser.id}`)
        .expect(204);

      // Verify user list doesn't contain deleted user
      const getUsersResponse = await request(server)
        .get('/users')
        .expect(200);

      const users = getUsersResponse.body.items;
      const foundUser = users.find(u => u.id === createdUser.id);
      
      expect(foundUser).toBeUndefined();
    });
  });
});

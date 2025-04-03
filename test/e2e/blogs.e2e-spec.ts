import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TestAppModule } from '../test-app.module';
import { CreateBlogDto } from '../../src/modules/bloggers-platform/blogs/api/dto/create-blog.dto';
import { BlogView } from '../../src/modules/bloggers-platform/blogs/domain/models/blog-view.interface';
import { appSetup } from '../../src/setup/app.setup';
import { PaginatedResult } from '../../src/core/infrastructure/pagination';
import mongoose from 'mongoose';

describe('BlogsController (e2e)', () => {
  let app: INestApplication;
  let server: any;
  let createdBlogId: string;

  const testBlog: CreateBlogDto = {
    name: 'Test Blog',
    description: 'This is a test blog for e2e testing',
    websiteUrl: 'https://example.com/test-blog',
  };

  const updatedBlog: CreateBlogDto = {
    name: 'Updated Blog',
    description: 'This blog has been updated',
    websiteUrl: 'https://example.com/updated-blog',
  };

  beforeAll(async () => {
    // Connect to test database
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestAppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    appSetup(app);
    await app.init();
    server = app.getHttpServer();

    // Clear test database before starting tests
    await request(server).delete('/testing/all-data').expect(204);
  });

  afterAll(async () => {
    // Disconnect and close app
    await mongoose.disconnect();
    await app.close();
  });

  describe('POST /blogs', () => {
    it('should create a new blog and return it', async () => {
      const response = await request(server)
        .post('/blogs')
        .send(testBlog)
        .expect(201);

      const createdBlog: BlogView = response.body;
      createdBlogId = createdBlog.id;

      expect(createdBlog).toMatchObject({
        id: expect.any(String),
        name: testBlog.name,
        description: testBlog.description,
        websiteUrl: testBlog.websiteUrl,
      });
    });

    it('should return 400 for invalid blog data', async () => {
      const invalidBlog = {
        name: '', // Empty name should be invalid
        description: testBlog.description,
        websiteUrl: testBlog.websiteUrl,
      };

      await request(server)
        .post('/blogs')
        .send(invalidBlog)
        .expect(400);
    });
  });

  describe('GET /blogs', () => {
    it('should return a paginated list of blogs', async () => {
      const response = await request(server)
        .get('/blogs')
        .expect(200);

      const result: PaginatedResult<BlogView> = response.body;

      expect(result).toMatchObject({
        items: expect.any(Array),
        totalCount: expect.any(Number),
        page: expect.any(Number),
        pageSize: expect.any(Number),
      });

      expect(result.items.length).toBeGreaterThan(0);
      expect(result.items[0]).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        description: expect.any(String),
        websiteUrl: expect.any(String),
      });
    });

    it('should filter blogs by search term', async () => {
      // Create a blog with unique name for testing search
      const uniqueBlog: CreateBlogDto = {
        name: 'UniqueSearch',
        description: 'This is a unique blog for search testing',
        websiteUrl: 'https://example.com/unique-blog',
      };

      await request(server)
        .post('/blogs')
        .send(uniqueBlog)
        .expect(201);

      // Search for the unique blog
      const response = await request(server)
        .get('/blogs?searchNameTerm=UniqueSearch')
        .expect(200);

      const result: PaginatedResult<BlogView> = response.body;

      expect(result.items.length).toBeGreaterThan(0);
      expect(result.items.some(blog => blog.name === uniqueBlog.name)).toBe(true);
    });

    it('should paginate results correctly', async () => {
      // Create multiple blogs for pagination testing
      const blogs = [
        {
          name: 'Page Test 1',
          description: 'Pagination test blog 1',
          websiteUrl: 'https://example.com/pagination-1',
        },
        {
          name: 'Page Test 2',
          description: 'Pagination test blog 2',
          websiteUrl: 'https://example.com/pagination-2',
        },
        {
          name: 'Page Test 3',
          description: 'Pagination test blog 3',
          websiteUrl: 'https://example.com/pagination-3',
        },
      ];

      for (const blog of blogs) {
        await request(server)
          .post('/blogs')
          .send(blog)
          .expect(201);
      }

      // Test first page with pageSize=2
      const firstPageResponse = await request(server)
        .get('/blogs?pageNumber=1&pageSize=2')
        .expect(200);

      const firstPageResult: PaginatedResult<BlogView> = firstPageResponse.body;
      expect(firstPageResult.items.length).toBeLessThanOrEqual(2);
      expect(firstPageResult.page).toBe(1);
      expect(firstPageResult.pageSize).toBe(2);

      // Test second page
      const secondPageResponse = await request(server)
        .get('/blogs?pageNumber=2&pageSize=2')
        .expect(200);

      const secondPageResult: PaginatedResult<BlogView> = secondPageResponse.body;
      expect(secondPageResult.page).toBe(2);
      
      // Ensure different items on different pages
      const firstPageIds = firstPageResult.items.map(blog => blog.id);
      const secondPageIds = secondPageResult.items.map(blog => blog.id);
      
      for (const id of secondPageIds) {
        expect(firstPageIds).not.toContain(id);
      }
    });
  });

  describe('GET /blogs/:id', () => {
    it('should return a blog by id', async () => {
      const response = await request(server)
        .get(`/blogs/${createdBlogId}`)
        .expect(200);

      const blog: BlogView = response.body;
      
      expect(blog).toMatchObject({
        id: createdBlogId,
        name: testBlog.name,
        description: testBlog.description,
        websiteUrl: testBlog.websiteUrl,
      });
    });

    it('should return 404 for non-existent blog id', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      
      await request(server)
        .get(`/blogs/${nonExistentId}`)
        .expect(404);
    });
  });

  describe('PUT /blogs/:id', () => {
    it('should update an existing blog', async () => {
      await request(server)
        .put(`/blogs/${createdBlogId}`)
        .send(updatedBlog)
        .expect(204);

      // Verify the blog was updated
      const response = await request(server)
        .get(`/blogs/${createdBlogId}`)
        .expect(200);

      const blog: BlogView = response.body;
      
      expect(blog).toMatchObject({
        id: createdBlogId,
        name: updatedBlog.name,
        description: updatedBlog.description,
        websiteUrl: updatedBlog.websiteUrl,
      });
    });

    it('should return 404 for updating non-existent blog', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      
      await request(server)
        .put(`/blogs/${nonExistentId}`)
        .send(updatedBlog)
        .expect(404);
    });

    it('should return 400 for invalid update data', async () => {
      const invalidBlog = {
        name: 'A'.repeat(20), // Name too long (>15 chars)
        description: updatedBlog.description,
        websiteUrl: updatedBlog.websiteUrl,
      };

      await request(server)
        .put(`/blogs/${createdBlogId}`)
        .send(invalidBlog)
        .expect(400);
    });
  });

  describe('DELETE /blogs/:id', () => {
    it('should delete an existing blog', async () => {
      // First create a blog to delete
      const createResponse = await request(server)
        .post('/blogs')
        .send({
          name: 'Blog to Delete',
          description: 'This blog will be deleted',
          websiteUrl: 'https://example.com/delete-me',
        })
        .expect(201);

      const blogToDeleteId = createResponse.body.id;

      // Delete the blog
      await request(server)
        .delete(`/blogs/${blogToDeleteId}`)
        .expect(204);

      // Verify the blog was deleted
      await request(server)
        .get(`/blogs/${blogToDeleteId}`)
        .expect(404);
    });

    it('should return 404 for deleting non-existent blog', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      
      await request(server)
        .delete(`/blogs/${nonExistentId}`)
        .expect(404);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PROFILE_REPOSITORY } from '../src/profiles/profiles.module';
import { MockProfileRepository } from './repositories/mock-profile.repository';
import { TutoringSessionRepository } from '../src/tutoring/domain/repositories/tutoring-session.repository.interface';
import { MockTutoringSessionRepository } from './repositories/mock-tutoring.repository';
import { CourseRepository } from '../src/courses/domain/repositories/course.repository.interface';
import { MockCourseRepository } from './repositories/mock-course.repository';
import { SemesterRepository } from '../src/semesters/domain/repositories/semester.repository.interface';
import { MockSemesterRepository } from './repositories/mock-semester.repository';
import { AuthService } from '../src/auth/auth.service';

const mockAuthService = {
  register: jest.fn(),
  login: jest.fn(),
  logout: jest.fn(),
  validateToken: jest.fn(),
  deleteUser: jest.fn().mockResolvedValue({ success: true })
};

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .overrideProvider(PROFILE_REPOSITORY)
    .useClass(MockProfileRepository)
    .overrideProvider(TutoringSessionRepository)
    .useClass(MockTutoringSessionRepository)
    .overrideProvider(CourseRepository)
    .useClass(MockCourseRepository)
    .overrideProvider(SemesterRepository)
    .useClass(MockSemesterRepository)
    .overrideProvider(AuthService)
    .useValue(mockAuthService)
    .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }));
    
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect(res => {
        expect(res.body.status).toBe('ok');
        expect(res.body.timestamp).toBeDefined();
      });
  });

  // Agregar más pruebas para los puntos de integración principales
});
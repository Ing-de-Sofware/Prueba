// test/integration/profiles.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { ProfilesModule } from '../../src/profiles/profiles.module';
import { PROFILE_REPOSITORY } from '../../src/profiles/profiles.module';
import { MockProfileRepository } from '../repositories/mock-profile.repository';
import { AuthService } from '../../src/auth/auth.service';
import { Profile } from '../../src/profiles/domain/models/profile.model';

describe('ProfilesController (e2e)', () => {
  let app: INestApplication;
  let repository: MockProfileRepository;
  
  const mockAuthService = {
    deleteUser: jest.fn().mockResolvedValue({ success: true })
  };

  // Función de ayuda para crear perfiles de prueba con valores por defecto
  const createTestProfileData = (override = {}) => ({
    id: 'test-id',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    gender: 'male',
    role: 'student',
    semesterNumber: 1,
    academicYear: '2023',
    avatar: null,
    bio: 'Estudiante de prueba',
    phone: '123456789',
    status: 'active',
    ...override
  });

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ProfilesModule],
    })
    .overrideProvider(PROFILE_REPOSITORY)
    .useClass(MockProfileRepository)
    .overrideProvider(AuthService)
    .useValue(mockAuthService)
    .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }));
    
    repository = moduleFixture.get<MockProfileRepository>(PROFILE_REPOSITORY);
    
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/profiles (GET)', () => {
    it('should return an array of profiles', async () => {
      // Arrange - añadir perfiles de prueba
      await repository.create(createTestProfileData({
        id: 'test-id-1',
        email: 'test1@example.com'
      }));
      
      // Act & Assert
      return request(app.getHttpServer())
        .get('/profiles')
        .expect(200)
        .expect(res => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body[0].email).toBe('test1@example.com');
        });
    });
  });

  describe('/profiles/:id (GET)', () => {
    it('should return a profile by id', async () => {
      // Arrange
      const profile = await repository.create(createTestProfileData({
        id: 'test-id-2',
        email: 'test2@example.com',
        firstName: 'Test',
        lastName: 'User2',
        gender: 'female',
        semesterNumber: 2
      }));
      
      // Act & Assert
      return request(app.getHttpServer())
        .get(`/profiles/${profile.id}`)
        .expect(200)
        .expect(res => {
          expect(res.body.id).toBe(profile.id);
          expect(res.body.email).toBe('test2@example.com');
        });
    });

    it('should return 404 when profile not found', () => {
      return request(app.getHttpServer())
        .get('/profiles/non-existent-id')
        .expect(404);
    });
  });

  // Agregar más pruebas para los otros endpoints
});
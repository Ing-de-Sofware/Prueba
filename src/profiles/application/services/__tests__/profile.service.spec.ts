import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from '../profile.service';
import { PROFILE_REPOSITORY } from '../../../profiles.module';
import { MockProfileRepository } from '../../../../../test/repositories/mock-profile.repository';
import { Profile } from '../../../domain/models/profile.model';
import { AuthService } from '../../../../auth/auth.service';
import { NotFoundException } from '@nestjs/common';

const mockAuthService = {
  deleteUser: jest.fn().mockResolvedValue({ success: true })
};

describe('ProfileService', () => {
  let service: ProfileService;
  let repository: MockProfileRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: PROFILE_REPOSITORY,
          useClass: MockProfileRepository,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
    repository = module.get<MockProfileRepository>(PROFILE_REPOSITORY);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of profiles', async () => {
      // Arrange
      const profiles = [
        new Profile({
          id: '1',
          email: 'u202212222@upc.edu.pe',
          firstName: 'Test',
          lastName: 'User',
          gender: 'male',
          role: 'student',
          semesterNumber: 1
        }),
        new Profile({
          id: '2',
          email: 'test1@example.com',
          firstName: 'Test',
          lastName: 'User2',
          gender: 'female',
          role: 'student',
          semesterNumber: 2
        }),
      ];
      
      // Add the mock profiles to the repository
      await repository.create(profiles[0]);
      await repository.create(profiles[1]);
      
      // Act
      const result = await service.findAll();
      
      // Assert
      expect(result).toHaveLength(2);
      expect(result[0].email).toEqual('test1@example.com');
      expect(result[1].email).toEqual('test2@example.com');
    });
  });

  describe('findById', () => {
    it('should return a profile by id', async () => {
      // Arrange
      const profile = new Profile({
        id: '1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        gender: 'male',
        role: 'student',
        semesterNumber: 1
      });
      
      await repository.create(profile);
      
      // Act
      const result = await service.findById('1');
      
      // Assert
      expect(result).toBeDefined();
      expect(result.id).toEqual('1');
      expect(result.email).toEqual('test@example.com');
    });

    it('should throw NotFoundException when profile not found', async () => {
      // Act & Assert
      await expect(service.findById('999')).rejects.toThrow(NotFoundException);
    });
  });

  // Agrega más pruebas para los otros métodos del servicio
});
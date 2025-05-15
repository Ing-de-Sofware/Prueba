import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from '../profile.controller';
import { ProfileService } from '../../../application/services/profile.service';
import { Profile } from '../../../domain/models/profile.model';
import { CreateProfileDto } from '../../../application/dtos/create-profile.dto';
import { UpdateProfileDto } from '../../../application/dtos/update-profile.dto';
import { NotFoundException } from '@nestjs/common';

describe('ProfileController', () => {
  let controller: ProfileController;
  let service: ProfileService;

  const mockProfileService = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [
        {
          provide: ProfileService,
          useValue: mockProfileService,
        },
      ],
    }).compile();

    controller = module.get<ProfileController>(ProfileController);
    service = module.get<ProfileService>(ProfileService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of profiles', async () => {
      // Arrange
      const profiles = [
        new Profile({
          id: '1',
          email: 'test1@example.com',
          firstName: 'Test',
          lastName: 'User',
          gender: 'male',
          role: 'student',
          semesterNumber: 1
        }),
      ];
      
      mockProfileService.findAll.mockResolvedValue(profiles);
      
      const mockResponse = {
        setHeader: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
      };
      
      // Act
      await controller.findAll(mockResponse);
      
      // Assert
      expect(service.findAll).toHaveBeenCalled();
      expect(mockResponse.setHeader).toHaveBeenCalled();
      expect(mockResponse.send).toHaveBeenCalledWith(profiles);
    });
  });

  describe('findById', () => {
    it('should return a profile by id', async () => {
      // Arrange
      const profile = new Profile({
        id: '1',
        email: 'u202212222@upc.edu.pe',
        firstName: 'Test',
        lastName: 'User',
        gender: 'male',
        role: 'student',
        semesterNumber: 1
      });
      
      mockProfileService.findById.mockResolvedValue(profile);
      
      // Act
      const result = await controller.findById('1');
      
      // Assert
      expect(service.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(profile);
    });

    it('should throw NotFoundException when profile not found', async () => {
      // Arrange
      mockProfileService.findById.mockRejectedValue(new NotFoundException());
      
      // Act & Assert
      await expect(controller.findById('999')).rejects.toThrow(NotFoundException);
    });
  });

  // Agrega más pruebas para los otros métodos del controlador
});
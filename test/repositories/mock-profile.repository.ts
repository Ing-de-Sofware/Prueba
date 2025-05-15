import { ProfileRepository } from 'src/profiles/domain/repositories/profile.repository.interface';
import { Profile } from 'src/profiles/domain/models/profile.model';

export class MockProfileRepository implements ProfileRepository {
  private profiles: Profile[] = [];

  async findAll(): Promise<Profile[]> {
    return this.profiles;
  }

  async findById(id: string): Promise<Profile | null> {
    return this.profiles.find(profile => profile.id === id) || null;
  }

  async findByEmail(email: string): Promise<Profile | null> {
    return this.profiles.find(profile => profile.email === email) || null;
  }

  async create(profile: Profile): Promise<Profile> {
    const newProfile = new Profile({
      ...profile,
      id: profile.id || `test-id-${Date.now()}`
    });
    this.profiles.push(newProfile);
    return newProfile;
  }

  async update(id: string, profile: Partial<Profile>): Promise<Profile | null> {
    const index = this.profiles.findIndex(p => p.id === id);
    if (index === -1) return null;

    const currentProfile = this.profiles[index];
    const updatedProfile = new Profile({
      ...currentProfile,
      ...profile,
      id
    });
    
    this.profiles[index] = updatedProfile;
    return updatedProfile;
  }

  async delete(id: string): Promise<boolean> {
    const initialLength = this.profiles.length;
    this.profiles = this.profiles.filter(profile => profile.id !== id);
    return initialLength > this.profiles.length;
  }
}
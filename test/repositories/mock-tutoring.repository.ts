import { TutoringSessionRepository } from '../../src/tutoring/domain/repositories/tutoring-session.repository.interface';
import { TutoringSession } from '../../src/tutoring/domain/models/tutoring-session.model';
import { TutoringMaterial } from '../../src/tutoring/domain/models/tutoring-material.model';
import { TutoringReview } from '../../src/tutoring/domain/models/tutoring-review.model';
import { TutoringAvailableTime } from '../../src/tutoring/domain/models/tutoring-available-time.model';

export class MockTutoringSessionRepository implements TutoringSessionRepository {
  private tutoringSessions: TutoringSession[] = [];
  private materials: TutoringMaterial[] = [];
  private reviews: TutoringReview[] = [];
  private availableTimes: TutoringAvailableTime[] = [];

  async findAll(): Promise<TutoringSession[]> {
    return Promise.all(this.tutoringSessions.map(async session => {
      const materials = await this.getMaterials(session.id);
      const reviews = await this.getReviews(session.id);
      const availableTimes = await this.getAvailableTimes(session.id);
      
      return new TutoringSession({
        ...session,
        materials,
        reviews,
        availableTimes
      });
    }));
  }

  async findById(id: string): Promise<TutoringSession | null> {
    const session = this.tutoringSessions.find(s => s.id === id);
    if (!session) return null;
    
    const materials = await this.getMaterials(id);
    const reviews = await this.getReviews(id);
    const availableTimes = await this.getAvailableTimes(id);
    
    return new TutoringSession({
      ...session,
      materials,
      reviews,
      availableTimes
    });
  }

  async findByTutorId(tutorId: string): Promise<TutoringSession[]> {
    const sessions = this.tutoringSessions.filter(s => s.tutorId === tutorId);
    
    return Promise.all(sessions.map(async session => {
      const materials = await this.getMaterials(session.id);
      const reviews = await this.getReviews(session.id);
      const availableTimes = await this.getAvailableTimes(session.id);
      
      return new TutoringSession({
        ...session,
        materials,
        reviews,
        availableTimes
      });
    }));
  }

  async findByCourseId(courseId: string): Promise<TutoringSession[]> {
    const sessions = this.tutoringSessions.filter(s => s.courseId === courseId);
    
    return Promise.all(sessions.map(async session => {
      const materials = await this.getMaterials(session.id);
      const reviews = await this.getReviews(session.id);
      const availableTimes = await this.getAvailableTimes(session.id);
      
      return new TutoringSession({
        ...session,
        materials,
        reviews,
        availableTimes
      });
    }));
  }

  async create(tutoringSession: TutoringSession): Promise<TutoringSession> {
    const sessionId = tutoringSession.id || `tutoring-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    const newSession = new TutoringSession({
      ...tutoringSession,
      id: sessionId,
      createdAt: new Date(),
      updatedAt: new Date(),
      materials: [],
      reviews: [],
      availableTimes: []
    });
    
    this.tutoringSessions.push(newSession);
    
    // Add materials, reviews, available times if present
    if (tutoringSession.materials && tutoringSession.materials.length > 0) {
      for (const material of tutoringSession.materials) {
        await this.addMaterial(new TutoringMaterial({
          ...material,
          tutoringId: sessionId,
        }));
      }
    }
    
    if (tutoringSession.reviews && tutoringSession.reviews.length > 0) {
      for (const review of tutoringSession.reviews) {
        await this.addReview(new TutoringReview({
          ...review,
          tutoringId: sessionId,
        }));
      }
    }
    
    if (tutoringSession.availableTimes && tutoringSession.availableTimes.length > 0) {
      for (const time of tutoringSession.availableTimes) {
        await this.addAvailableTime(new TutoringAvailableTime({
          ...time,
          tutoringId: sessionId,
        }));
      }
    }
    
    return this.findById(sessionId) as Promise<TutoringSession>;
  }

  async update(id: string, tutoringSession: Partial<TutoringSession>): Promise<TutoringSession | null> {
    const index = this.tutoringSessions.findIndex(s => s.id === id);
    if (index === -1) return null;

    const currentSession = this.tutoringSessions[index];
    const updatedSession = new TutoringSession({
      ...currentSession,
      ...tutoringSession,
      id,
      updatedAt: new Date()
    });
    
    this.tutoringSessions[index] = updatedSession;
    
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const initialLength = this.tutoringSessions.length;
    this.tutoringSessions = this.tutoringSessions.filter(s => s.id !== id);
    
    // Also delete related entities
    this.materials = this.materials.filter(m => m.tutoringId !== id);
    this.reviews = this.reviews.filter(r => r.tutoringId !== id);
    this.availableTimes = this.availableTimes.filter(t => t.tutoringId !== id);
    
    return initialLength > this.tutoringSessions.length;
  }

  // Materials methods
  async addMaterial(material: TutoringMaterial): Promise<TutoringMaterial> {
    const newMaterial = new TutoringMaterial({
      ...material,
      id: material.id || `material-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    this.materials.push(newMaterial);
    return newMaterial;
  }

  async updateMaterial(id: string, material: Partial<TutoringMaterial>): Promise<TutoringMaterial | null> {
    const index = this.materials.findIndex(m => m.id === id);
    if (index === -1) return null;

    const currentMaterial = this.materials[index];
    const updatedMaterial = new TutoringMaterial({
      ...currentMaterial,
      ...material,
      id,
      updatedAt: new Date()
    });
    
    this.materials[index] = updatedMaterial;
    return updatedMaterial;
  }

  async deleteMaterial(id: string): Promise<boolean> {
    const initialLength = this.materials.length;
    this.materials = this.materials.filter(m => m.id !== id);
    return initialLength > this.materials.length;
  }

  async getMaterials(tutoringId: string): Promise<TutoringMaterial[]> {
    return this.materials.filter(m => m.tutoringId === tutoringId);
  }

  // Reviews methods
  async addReview(review: TutoringReview): Promise<TutoringReview> {
    const newReview = new TutoringReview({
      ...review,
      id: review.id || `review-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    this.reviews.push(newReview);
    return newReview;
  }

  async updateReview(id: string, review: Partial<TutoringReview>): Promise<TutoringReview | null> {
    const index = this.reviews.findIndex(r => r.id === id);
    if (index === -1) return null;

    const currentReview = this.reviews[index];
    const updatedReview = new TutoringReview({
      ...currentReview,
      ...review,
      id,
      updatedAt: new Date()
    });
    
    this.reviews[index] = updatedReview;
    return updatedReview;
  }

  async deleteReview(id: string): Promise<boolean> {
    const initialLength = this.reviews.length;
    this.reviews = this.reviews.filter(r => r.id !== id);
    return initialLength > this.reviews.length;
  }

  async getReviews(tutoringId: string): Promise<TutoringReview[]> {
    return this.reviews.filter(r => r.tutoringId === tutoringId);
  }

  // Available times methods
  async addAvailableTime(time: TutoringAvailableTime): Promise<TutoringAvailableTime> {
    const newTime = new TutoringAvailableTime({
      ...time,
      id: time.id || `time-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    this.availableTimes.push(newTime);
    return newTime;
  }

  async updateAvailableTime(id: string, time: Partial<TutoringAvailableTime>): Promise<TutoringAvailableTime | null> {
    const index = this.availableTimes.findIndex(t => t.id === id);
    if (index === -1) return null;

    const currentTime = this.availableTimes[index];
    const updatedTime = new TutoringAvailableTime({
      ...currentTime,
      ...time,
      id,
      updatedAt: new Date()
    });
    
    this.availableTimes[index] = updatedTime;
    return updatedTime;
  }

  async deleteAvailableTime(id: string): Promise<boolean> {
    const initialLength = this.availableTimes.length;
    this.availableTimes = this.availableTimes.filter(t => t.id !== id);
    return initialLength > this.availableTimes.length;
  }

  async getAvailableTimes(tutoringId: string): Promise<TutoringAvailableTime[]> {
    return this.availableTimes.filter(t => t.tutoringId === tutoringId);
  }
}
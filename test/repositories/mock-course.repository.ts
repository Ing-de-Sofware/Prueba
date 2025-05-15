import { CourseRepository } from '../../src/courses/domain/repositories/course.repository.interface';
import { Course } from '../../src/courses/domain/models/course.model';

export class MockCourseRepository implements CourseRepository {
  private courses: Course[] = [];

  async findAll(): Promise<Course[]> {
    return this.courses;
  }

  async findById(id: string): Promise<Course | null> {
    const course = this.courses.find(c => c.id === id);
    return course || null;
  }

  async findBySemesterNumber(semesterNumber: number): Promise<Course[]> {
    return this.courses.filter(c => c.semesterNumber === semesterNumber);
  }

  async create(course: Course): Promise<Course> {
    const newCourse = new Course({
      ...course,
      id: course.id || `course-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    });
    this.courses.push(newCourse);
    return newCourse;
  }

  async update(id: string, course: Partial<Course>): Promise<Course | null> {
    const index = this.courses.findIndex(c => c.id === id);
    if (index === -1) return null;

    const currentCourse = this.courses[index];
    const updatedCourse = new Course({
      ...currentCourse,
      ...course,
      id,
      updatedAt: new Date()
    });
    
    this.courses[index] = updatedCourse;
    return updatedCourse;
  }

  async delete(id: string): Promise<boolean> {
    const initialLength = this.courses.length;
    this.courses = this.courses.filter(c => c.id !== id);
    return initialLength > this.courses.length;
  }
}
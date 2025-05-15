import { SemesterRepository } from '../../src/semesters/domain/repositories/semester.repository.interface';
import { Semester } from '../../src/semesters/domain/models/semester.model';
import { Course } from '../../src/courses/domain/models/course.model';

export class MockSemesterRepository implements SemesterRepository {
  private semesters: Semester[] = [];
  private semesterCourses: Map<string, string[]> = new Map(); // semesterId -> courseIds[]

  async findAll(): Promise<Semester[]> {
    return Promise.all(this.semesters.map(async semester => {
      const courses = await this.getCourses(semester.id);
      return new Semester({
        ...semester,
        courses
      });
    }));
  }

  async findById(id: string): Promise<Semester | null> {
    const semester = this.semesters.find(s => s.id === id);
    if (!semester) return null;
    
    const courses = await this.getCourses(id);
    return new Semester({
      ...semester,
      courses
    });
  }

  async create(semester: Semester): Promise<Semester> {
    const newSemester = new Semester({
      ...semester,
      id: semester.id || `semester-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      courses: [],
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    this.semesters.push(newSemester);
    this.semesterCourses.set(newSemester.id, []);
    
    return newSemester;
  }

  async update(id: string, semester: Partial<Semester>): Promise<Semester | null> {
    const index = this.semesters.findIndex(s => s.id === id);
    if (index === -1) return null;

    const currentSemester = this.semesters[index];
    const updatedSemester = new Semester({
      ...currentSemester,
      ...semester,
      id,
      updatedAt: new Date()
    });
    
    this.semesters[index] = updatedSemester;
    
    const courses = await this.getCourses(id);
    return new Semester({
      ...updatedSemester,
      courses
    });
  }

  async delete(id: string): Promise<boolean> {
    const initialLength = this.semesters.length;
    this.semesters = this.semesters.filter(s => s.id !== id);
    this.semesterCourses.delete(id);
    
    return initialLength > this.semesters.length;
  }

  async addCourse(semesterId: string, courseId: string): Promise<void> {
    const courseIds = this.semesterCourses.get(semesterId) || [];
    
    if (!courseIds.includes(courseId)) {
      courseIds.push(courseId);
      this.semesterCourses.set(semesterId, courseIds);
    }
  }

  async removeCourse(semesterId: string, courseId: string): Promise<void> {
    const courseIds = this.semesterCourses.get(semesterId) || [];
    const updatedCourseIds = courseIds.filter(id => id !== courseId);
    this.semesterCourses.set(semesterId, updatedCourseIds);
  }

  async getCourses(semesterId: string): Promise<Course[]> {
    // Este método normalmente dependería del CourseRepository
    // En un entorno de prueba, podemos simplemente devolver cursos ficticios
    const courseIds = this.semesterCourses.get(semesterId) || [];
    return courseIds.map(id => new Course({
      id,
      name: `Course ${id}`,
      semesterNumber: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
  }
}
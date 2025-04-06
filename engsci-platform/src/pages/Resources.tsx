import { useEffect, useState } from 'react';
import SemesterTabs from '../components/resources/SemesterTabs';
import { CourseMetadata } from '../types/resources';

// Interface for a single semester
interface SemesterData {
  id: string;
  name: string;
  courses: CourseMetadata[];
}

const Resources = () => {
  // Define the useState hooks for the semestersData, loading, and error
  // semestersData init to empty array
  const [semestersData, setSemestersData] = useState<SemesterData[]>([]);
  // loading init to true
  const [loading, setLoading] = useState<boolean>(true);
  // error init to null
  const [error, setError] = useState<string | null>(null);

  // UseEffect hook that runs fetchSemesters when the component mounts
  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        setLoading(true); // loading = true
        
        const semesters = [
          { id: 'Y1F', name: 'Year 1 Fall' },
          { id: 'Y1W', name: 'Year 1 Winter' },
          { id: 'Y2F', name: 'Year 2 Fall' },
          { id: 'Y2W', name: 'Year 2 Winter' },
        ];
        
        // 
        const semestersWithCourses = await Promise.all(
          semesters.map(async (semester) => {
            try {
              const courseData = await import(`../data/semesters/${semester.id}.json`);
              return {
                ...semester,
                courses: courseData.default as CourseMetadata[]
              };
            } catch (e) {
              console.error(`Failed to load ${semester.id} data:`, e);
              return {
                ...semester,
                courses: [] as CourseMetadata[]
              };
            }
          })
        );
        
        setSemestersData(semestersWithCourses);
      } catch (err) {
        console.error('Error loading semester data:', err);
        setError('Failed to load resources. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSemesters();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Resources</h1>
      
      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
          {error}
        </div>
      ) : (
        <SemesterTabs tabs={semestersData} />
      )}
    </div>
  );
};

export default Resources; 
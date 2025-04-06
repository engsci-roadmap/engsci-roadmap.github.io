import { useEffect, useState } from "react";
import SemesterTabs from "../components/resources/SemesterTabs";
import { CourseMetadata } from "../types/resources";

// Interface for semester data structure that will be passed to SemesterTabs component
interface SemesterData {
  id: string; // Semester ID (e.g., 'Y1F', 'Y1W')
  name: string; // Display name (e.g., 'Year 1 Fall')
  courses: CourseMetadata[]; // Array of courses for this semester
}

// Resources page component 
const Resources = () => {
  // State to store all semesters with their courses, initialized as empty array
  const [semestersData, setSemestersData] = useState<SemesterData[]>([]);
  // Loading state to show loading indicator when fetching data
  const [loading, setLoading] = useState<boolean>(true);
  // Error state to display error message if data fetching fails
  const [error, setError] = useState<string | null>(null);

  // useEffect hook to fetch semester data when component mounts (empty dependency array)
  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        setLoading(true); // Set loading to true before fetching data

        // Define the semesters we want to display
        // This array defines the order they'll appear in the UI
        const semesters = [
          { id: "Y1F", name: "Year 1 Fall" },
          { id: "Y1W", name: "Year 1 Winter" },
          { id: "Y2F", name: "Year 2 Fall" },
          { id: "Y2W", name: "Year 2 Winter" },
        ];

        // Use Promise.all to fetch course data for all semesters in parallel
        const semestersWithCourses = await Promise.all(
          semesters.map(async (semester) => {
            try {
              // Dynamically import the JSON file for this semester
              const courseData = await import(
                `../data/semesters/${semester.id}.json`
              );
              // Return the semester with its courses data
              return {
                ...semester,
                courses: courseData.default as CourseMetadata[],
              };
            } catch (e) {
              // Log error and return empty courses array if file can't be loaded
              console.error(`Failed to load ${semester.id} data:`, e);
              return {
                ...semester,
                courses: [] as CourseMetadata[],
              };
            }
          })
        );

        // Update state with the loaded semester data
        setSemestersData(semestersWithCourses);
      } catch (err) {
        // Handle any overall errors in the data fetching process
        console.error("Error loading semester data:", err);
        setError("Failed to load resources. Please try again later.");
      } finally {
        // Set loading to false regardless of success or failure
        setLoading(false);
      }
    };

    // Call the fetch function when component mounts
    fetchSemesters();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Resources</h1>

      {/* Conditional rendering based on loading and error states */}
      {loading ? (
        // Show loading skeleton while data is being fetched
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      ) : error ? (
        // Show error message if there was a problem loading data
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
          {error}
        </div>
      ) : (
        // If data loaded successfully, render SemesterTabs component with the data
        <SemesterTabs tabs={semestersData} />
      )}
    </div>
  );
};

export default Resources;

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Define types for the course data
interface LinkedCourse {
  courseCode: string;
  importance: "high" | "medium" | "low";
}

interface MajorRelevance {
  majorId: string;
  linkedCourses: LinkedCourse[];
}

interface Topic {
  id: string;
  label: string;
  relevantTo: MajorRelevance[];
}

interface Course {
  id: string;
  label: string;
  topics: Topic[];
}

// Define the list of majors with both internal ID and URL-friendly slug
const majors = [
  { id: "BME", slug: "bme", name: "Biomedical" },
  { id: "MI", slug: "mi", name: "Machine Intelligence" },
  { id: "ECE", slug: "ece", name: "Electrical & Computer" },
  { id: "AERO", slug: "aero", name: "Aerospace" },
  { id: "ROB", slug: "robo", name: "Robotics" },
  { id: "MSF", slug: "msf", name: "Mathematics, Statistics & Finance" },
  { id: "ES", slug: "energy", name: "Energy Systems" },
  { id: "EP", slug: "engphys", name: "Engineering Physics" },
];

// Mapping functions between internal IDs and URL slugs
const getInternalIdFromSlug = (slug: string): string => {
  const major = majors.find((m) => m.slug === slug);
  return major ? major.id : "BME"; // Default to BME if not found
};

const getSlugFromInternalId = (id: string): string => {
  const major = majors.find((m) => m.id === id);
  return major ? major.slug : "bme"; // Default to bme if not found
};

const Majors = () => {
  const { majorId } = useParams<{ majorId?: string }>();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // If on the base majors path with no majorId, redirect to the first major
  useEffect(() => {
    if (!majorId) {
      navigate("/majors/bme", { replace: true });
    }
  }, [majorId, navigate]);

  // Determine the selected major from the URL parameter, or default to BME
  const [selectedMajor, setSelectedMajor] = useState<string>(
    majorId ? getInternalIdFromSlug(majorId) : "BME"
  );

  // Update selected major when URL parameter changes
  useEffect(() => {
    if (majorId) {
      const internalId = getInternalIdFromSlug(majorId);
      setSelectedMajor(internalId);
    }
  }, [majorId]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await fetch("/data/courses.json");
        if (!response.ok) {
          throw new Error("Failed to fetch courses data");
        }
        const data = await response.json();
        setCourses(data);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Filter courses and topics by the selected major
  const filteredCourses = courses
    .map((course) => {
      // Get topics relevant to the selected major
      const filteredTopics = course.topics.filter((topic) =>
        topic.relevantTo.some(
          (relevance) => relevance.majorId === selectedMajor
        )
      );

      // Filter each topic's relevantTo to only include the selected major
      const processedTopics = filteredTopics.map((topic) => {
        return {
          ...topic,
          relevantTo: topic.relevantTo.filter(
            (relevance) => relevance.majorId === selectedMajor
          ),
        };
      });

      return {
        ...course,
        topics: processedTopics,
      };
    })
    .filter((course) => course.topics.length > 0);

  // Helper function to render importance badge
  const renderImportanceBadge = (importance: string) => {
    switch (importance) {
      case "high":
        return (
          <span className="ml-2 inline-block text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
            High Importance
          </span>
        );
      case "medium":
        return (
          <span className="ml-2 inline-block text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
            Medium
          </span>
        );
      case "low":
        return (
          <span className="ml-2 inline-block text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
            Low
          </span>
        );
      default:
        return null;
    }
  };

  // Update URL when tab changes by navigating to the new path
  const handleTabClick = (majorId: string) => {
    setSelectedMajor(majorId);

    // Navigate to the new URL path
    const slug = getSlugFromInternalId(majorId);
    navigate(`/majors/${slug}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Y1/Y2 Course Relevance to Majors
      </h1>
      <p className="text-gray-600 mb-8">
        Explore how topics from foundation courses connect to upper-year courses
        in each major.
      </p>

      {/* Tab navigation */}
      <div className="border-b border-gray-200 mb-8">
        <div className="flex overflow-x-auto pb-2">
          {majors.map((major) => (
            <button
              key={major.id}
              className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
                selectedMajor === major.id
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              onClick={() => handleTabClick(major.id)}
            >
              {major.name}
            </button>
          ))}
        </div>
      </div>

      {/* Content area */}
      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
          {error}
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-blue-700">
          No connections available yet for{" "}
          {majors.find((m) => m.id === selectedMajor)?.name} major.
        </div>
      ) : (
        <div className="space-y-8">
          {filteredCourses.map((course) => (
            <div key={course.id} className="mb-6">
              <h3 className="text-md font-semibold text-slate-800 mb-3">
                {course.id} – {course.label}
              </h3>

              <ul className="ml-4 list-disc text-sm text-slate-700 space-y-4">
                {course.topics.map((topic) => (
                  <li key={topic.id}>
                    <span className="font-medium">{topic.label}</span> → used
                    in:
                    <ul className="ml-4 list-none mt-2 space-y-2">
                      {topic.relevantTo[0].linkedCourses.map(
                        (linkedCourse, index) => (
                          <li key={index} className="flex items-start">
                            <code className="text-xs bg-slate-100 px-2 py-0.5 rounded">
                              {linkedCourse.courseCode}
                            </code>
                            {renderImportanceBadge(linkedCourse.importance)}
                          </li>
                        )
                      )}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Majors;

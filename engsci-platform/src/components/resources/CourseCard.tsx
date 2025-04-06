import { useState, useEffect } from "react";
import { CourseMetadata, CourseResources } from "../../types/resources";

// Interface
  // prop: course
  // type: CourseMetadata
interface CourseCardProps { 
  course: CourseMetadata;
}

// CourseCard component (input: course prop) and (returns a div)
const CourseCard = ({ course }: CourseCardProps) => {
  // Resources state that sets resources to CourseResources or null if resources not found
  const [resources, setResources] = useState<CourseResources | null>(null);
  // Loading state that initializes to true and updates when resources are fetched
  // True = loading, False = not loading
  const [loading, setLoading] = useState<boolean>(true);

  // UseEffect hook that runs fetchResources when course.resources or course.code changes 
  useEffect(() => {
    const fetchResources = async () => { 
      try {
        setLoading(true); // loading = true
        const resourcesData = await import(
          `../../data/${course.resources}`
        ); /* @vite-ignore */
        setResources(resourcesData.default);
      } catch (error) {
        console.error(`Failed to load resources for ${course.code}:`, error);
      } finally {
        setLoading(false); // loading = false
      }
    };

    fetchResources();
  }, [course.resources, course.code]);

  // Handle view which gets the cheatsheet or process sheet file from resources and opens it in a new tab
  const handleView = (fileType: "cheatsheet" | "processSheet") => {
    if (!resources) return;

    const fileInfo = resources[fileType];
    window.open( // opens the file in a new tab
      `/src/data/resources/${resources.courseCode}/${fileInfo.file}`,
      "_blank"
    );
  };

  // Handle download which creates an anchor element and triggers download with the correct file path
  const handleDownload = (fileType: "cheatsheet" | "processSheet") => {
    if (!resources) return;

    const fileInfo = resources[fileType];
    // Create an anchor element and trigger download with the correct file path
    const link = document.createElement("a");
    link.href = `/src/data/resources/${resources.courseCode}/${fileInfo.file}`;
    link.download = fileInfo.file;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // If loading = true, return a loading state
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-5 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  // If resources = null, return a message
  if (!resources) {
    return (
      <div className="bg-white rounded-lg shadow-md p-5">
        <h3 className="text-lg font-medium">
          {course.code} 
        </h3>
        <p className="text-red-500 mt-2">Resources unavailable</p>
      </div>
    );
  }

  // If resources are found, return the course card
  return (
    <div className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-medium text-center">
        {resources.courseCode} 
      </h3>

      {/* Cheatsheet */}
      <div className="mt-4">
        <h4 className="font-medium text-sm text-gray-700">
          {resources.cheatsheet.title}
        </h4>
        <div className="mt-2 flex space-x-2">
          <button
            onClick={() => handleView("cheatsheet")}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
          >
            View
          </button>
          <button
            onClick={() => handleDownload("cheatsheet")}
            className="px-3 py-1 bg-gray-200 text-gray-800 text-sm rounded hover:bg-gray-300 transition-colors"
          >
            Download
          </button>
        </div>
      </div>

      {/* Process Sheet */}
      <div className="mt-4">
        <h4 className="font-medium text-sm text-gray-700">
          {resources.processSheet.title}
        </h4>
        <div className="mt-2 flex space-x-2">
          <button
            onClick={() => handleView("processSheet")}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
          >
            View
          </button>
          <button
            onClick={() => handleDownload("processSheet")}
            className="px-3 py-1 bg-gray-200 text-gray-800 text-sm rounded hover:bg-gray-300 transition-colors"
          >
            Download
          </button>
        </div>
      </div>

      {/* External Links */}
      {resources.externalLinks.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium text-sm text-gray-700">
            External Resources
          </h4>
          <ul className="mt-2 space-y-1">
            {resources.externalLinks.map((link, index) => (
              <li key={index}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm flex items-center"
                >
                  {link.icon && <span className="mr-1">{link.icon}</span>}
                  {link.title}
                </a>
                {link.description && (
                  <p className="text-xs text-gray-500 ml-5">
                    {link.description}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CourseCard;

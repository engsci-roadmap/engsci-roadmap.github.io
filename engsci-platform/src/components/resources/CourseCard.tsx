import { useState, useEffect } from "react";
import { CourseMetadata, CourseResources } from "../../types/resources";

interface CourseCardProps {
  course: CourseMetadata;
}

const CourseCard = ({ course }: CourseCardProps) => {
  const [resources, setResources] = useState<CourseResources | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const resourcesData = await import(`../../data/${course.resources}`);
        setResources(resourcesData.default);
      } catch (error) {
        console.error(`Failed to load resources for ${course.code}:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [course.resources, course.code]);

  const handleView = (fileType: "cheatsheet" | "processSheet") => {
    if (!resources) return;

    const fileInfo = resources[fileType];
    // Use the correct path to PDF files in the data/resources/[COURSE] directory
    window.open(
      `/src/data/resources/${resources.courseCode}/${fileInfo.file}`,
      "_blank"
    );
  };

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

  if (!resources) {
    return (
      <div className="bg-white rounded-lg shadow-md p-5">
        <h3 className="text-lg font-medium">
          {course.code} – {course.title}
        </h3>
        <p className="text-red-500 mt-2">Resources unavailable</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-medium">
        {resources.courseCode} – {resources.courseName}
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

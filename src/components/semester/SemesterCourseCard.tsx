import { Link } from "react-router-dom";
import { CourseMetadata } from "../../types/resources";
import {
  FaRoad,
  FaQuestion,
  FaFileAlt,
  FaLink,
  FaEye,
  FaDownload,
} from "react-icons/fa";
import { useEffect, useState } from "react";

interface SemesterCourseCardProps {
  course: CourseMetadata;
  semester: string;
}

interface ResourceFile {
  title: string;
  file: string;
}

interface ExternalLink {
  title: string;
  url: string;
  icon?: string;
  description?: string;
}

interface CourseResourceData {
  courseCode: string;
  courseName: string;
  cheatsheet?: ResourceFile;
  processSheet?: ResourceFile;
  externalLinks?: ExternalLink[];
}

const SemesterCourseCard = ({ course, semester }: SemesterCourseCardProps) => {
  const [resources, setResources] = useState<CourseResourceData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/resources/${course.code}/index.json`);
        if (response.ok) {
          const data = await response.json();
          setResources(data);
        } else {
          console.error(`No resources found for ${course.code}`);
          setResources(null);
        }
      } catch (error) {
        console.error(`Error loading resources for ${course.code}:`, error);
        setResources(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResources();
  }, [course.code]);

  const handleView = (fileType: "cheatsheet" | "processSheet") => {
    if (!resources) return;
    const fileInfo = resources[fileType];
    if (!fileInfo) return;

    window.open(
      `/resources/${resources.courseCode}/${fileInfo.file}`,
      "_blank"
    );
  };

  const handleDownload = (fileType: "cheatsheet" | "processSheet") => {
    if (!resources) return;
    const fileInfo = resources[fileType];
    if (!fileInfo) return;

    const link = document.createElement("a");
    link.href = `/resources/${resources.courseCode}/${fileInfo.file}`;
    link.download = fileInfo.file;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
      <h3 className="text-xl font-semibold text-blue-700 text-center">
        {course.code}
      </h3>
      <p className="text-gray-600 text-sm text-center mt-1 mb-4">
        {course.title}
      </p>

      {/* Resource sections */}
      {resources && !isLoading && (
        <div className="space-y-4 mt-2 mb-4">
          {/* Cheatsheet section */}
          {resources.cheatsheet && (
            <div>
              <div className="flex items-center mb-2">
                <FaFileAlt className="text-sky-700 mr-2" />
                <span className="font-medium text-gray-700">Cheatsheet</span>
              </div>
              <div className="flex space-x-2 pl-5">
                <button
                  onClick={() => handleView("cheatsheet")}
                  className="inline-flex items-center px-3 py-1 rounded-md text-sm bg-sky-100 hover:bg-sky-200 text-sky-800 font-medium transition"
                >
                  <FaEye className="mr-1" /> View
                </button>
                <button
                  onClick={() => handleDownload("cheatsheet")}
                  className="inline-flex items-center px-3 py-1 rounded-md text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium transition"
                >
                  <FaDownload className="mr-1" /> Download
                </button>
              </div>
            </div>
          )}

          {/* Process Sheet section */}
          {resources.processSheet && (
            <div>
              <div className="flex items-center mb-2">
                <FaFileAlt className="text-sky-700 mr-2" />
                <span className="font-medium text-gray-700">Process Sheet</span>
              </div>
              <div className="flex space-x-2 pl-5">
                <button
                  onClick={() => handleView("processSheet")}
                  className="inline-flex items-center px-3 py-1 rounded-md text-sm bg-sky-100 hover:bg-sky-200 text-sky-800 font-medium transition"
                >
                  <FaEye className="mr-1" /> View
                </button>
                <button
                  onClick={() => handleDownload("processSheet")}
                  className="inline-flex items-center px-3 py-1 rounded-md text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium transition"
                >
                  <FaDownload className="mr-1" /> Download
                </button>
              </div>
            </div>
          )}

          {/* External Links section */}
          {resources.externalLinks && resources.externalLinks.length > 0 && (
            <div>
              <div className="flex items-center mb-2">
                <FaLink className="text-sky-700 mr-2" />
                <span className="font-medium text-gray-700">
                  External Links
                </span>
              </div>
              <ul className="pl-5 space-y-2">
                {resources.externalLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-sky-700 hover:underline"
                    >
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="mt-auto pt-3 space-y-2">
        <Link
          to={`/${semester}/${course.code.toLowerCase()}`}
          className="inline-flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <FaRoad className="mr-2" />
          <span>View Roadmap</span>
        </Link>
        <Link
          to={`/${semester}/${course.code.toLowerCase()}/problems`}
          className="inline-flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <FaQuestion className="mr-2" />
          <span>View Problems</span>
        </Link>
      </div>
    </div>
  );
};

export default SemesterCourseCard;

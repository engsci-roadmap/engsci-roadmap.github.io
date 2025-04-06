import { Link } from "react-router-dom";
import { CourseMetadata } from "../../types/resources";
import { FaRoad } from "react-icons/fa";

interface SemesterCourseCardProps {
  course: CourseMetadata;
  semester: string;
}

const SemesterCourseCard = ({ course, semester }: SemesterCourseCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
        <h3 className="text-xl font-semibold text-blue-700 text-center">
          {course.code}
        </h3>
      <div className="mt-auto pt-3">
        <Link
          to={`/${semester}/${course.code.toLowerCase()}`}
          className="inline-flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <FaRoad className="mr-2" />
          <span>View Roadmap</span>
        </Link>
      </div>
    </div>
  );
};

export default SemesterCourseCard;

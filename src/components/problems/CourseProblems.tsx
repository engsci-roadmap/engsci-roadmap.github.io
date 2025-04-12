import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getProblemsData } from "../../utils/courseDataUtils";
import { FaArrowLeft } from "react-icons/fa";

type TopicWithQuestions = {
  topicId: string;
  label: string;
  questions: string[];
};

interface CourseProblemsProps {
  courseCode: string;
  semester: string;
}

const CourseProblems = ({ courseCode, semester }: CourseProblemsProps) => {
  const [topics, setTopics] = useState<TopicWithQuestions[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProblems = async () => {
      try {
        setLoading(true);
        // Dynamically import the problems file
        const problemsModule = await import(
          `../../data/problems/${courseCode}.json`
        ).catch((e) => {
          console.error(`Failed to load problems for ${courseCode}:`, e);
          throw new Error(`No problems found for ${courseCode}`);
        });

        const problems = getProblemsData(problemsModule.default);
        setTopics(problems);
      } catch (err) {
        console.error("Error loading problems:", err);
        setError(
          err instanceof Error
            ? err.message
            : `Failed to load problems for ${courseCode}`
        );
      } finally {
        setLoading(false);
      }
    };

    loadProblems();
  }, [courseCode]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link
          to={`/${semester}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <FaArrowLeft className="mr-2" />
          <span>Back to {semester.toUpperCase()}</span>
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        {courseCode} Practice Problems
      </h1>

      {loading ? (
        <p className="text-gray-600">Loading problems...</p>
      ) : error ? (
        <div className="p-6 bg-gray-100 rounded-lg">
          <p className="text-gray-700">
            There are no curated problems available for this course yet.
          </p>
        </div>
      ) : topics.length === 0 ? (
        <div className="p-6 bg-gray-100 rounded-lg">
          <p className="text-gray-700">
            There are no curated problems available for this course yet.
          </p>
        </div>
      ) : (
        <div>
          {topics.map((topic) => (
            <div key={topic.topicId} className="mb-8">
              <h2 className="text-lg font-semibold text-sky-700 mt-6">
                {topic.label}
              </h2>
              {topic.questions && topic.questions.length > 0 ? (
                <ol className="list-decimal ml-5 mt-2 text-gray-700 text-sm space-y-2">
                  {topic.questions.map((question, index) => (
                    <li key={index} className="pl-1">
                      {question}
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-sm text-gray-500 ml-5 mt-2">
                  No questions available for this topic.
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseProblems;

import { ReactNode } from "react";
import { FiX } from "react-icons/fi";

type SidebarDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  topic: string;
  questions: ReactNode[];
};

const SidebarDrawer = ({
  isOpen,
  onClose,
  topic,
  questions,
}: SidebarDrawerProps) => {
  return (
    <>
      {/* Backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full sm:w-3/4 md:w-1/2 lg:w-1/2 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } overflow-y-auto`}
        aria-labelledby="sidebar-title"
        role="dialog"
        aria-modal="true"
      >
        <div className="p-6 md:p-8 lg:p-10 h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2
              id="sidebar-title"
              className="text-2xl md:text-3xl font-bold text-blue-700"
            >
              {topic}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-200 transition-colors"
              aria-label="Close sidebar"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-grow">
            <h3 className="text-xl md:text-2xl font-semibold mb-4 text-blue-800">
              Practice Questions
            </h3>
            {questions && questions.length > 0 ? (
              <ol className="list-decimal ml-5 mt-2 text-gray-700 text-sm space-y-2">
                {questions.map((question, index) => (
                  <li key={index} className="pl-1">
                    {question}
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-gray-600">
                No practice questions available for this topic.
              </p>
            )}

            <div className="mt-6 text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Click on another topic in the graph to see more questions
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarDrawer;

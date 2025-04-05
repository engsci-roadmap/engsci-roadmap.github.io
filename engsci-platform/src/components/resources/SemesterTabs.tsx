import { useState } from "react";
import { CourseMetadata } from "../../types/resources";
import CourseCard from "./CourseCard.tsx";

interface SemesterTab {
  id: string;
  name: string;
  courses: CourseMetadata[];
}

interface SemesterTabsProps {
  tabs: SemesterTab[];
}

const SemesterTabs = ({ tabs }: SemesterTabsProps) => {
  const [activeTab, setActiveTab] = useState<string>(tabs[0]?.id || "");

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };

  return (
    <div className="w-full">
      {/* Desktop tabs */}
      <div className="hidden md:flex mb-4 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === tab.id
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Mobile accordion */}
      <div className="md:hidden">
        {tabs.map((tab) => (
          <div key={tab.id} className="border-b">
            <button
              onClick={() => handleTabClick(tab.id === activeTab ? "" : tab.id)}
              className="flex justify-between items-center w-full px-4 py-3 text-left font-medium"
            >
              <span>{tab.name}</span>
              <svg
                className={`h-5 w-5 transform ${
                  activeTab === tab.id ? "rotate-180" : ""
                }`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {activeTab === tab.id && (
              <div className="px-4 py-3 bg-gray-50">
                <div className="grid gap-4">
                  {tab.courses.map((course) => (
                    <CourseCard key={course.code} course={course} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Desktop tab content */}
      <div className="hidden md:block pt-4">
        {tabs.map(
          (tab) =>
            activeTab === tab.id && (
              <div
                key={tab.id}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {tab.courses.map((course) => (
                  <CourseCard key={course.code} course={course} />
                ))}
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default SemesterTabs;

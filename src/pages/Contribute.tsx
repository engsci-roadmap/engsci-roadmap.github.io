import {
  FaGithub,
  FaEdit,
  FaRoad,
  FaFileAlt,
  FaExternalLinkAlt,
} from "react-icons/fa";

const Contribute = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <header className="mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-700 mb-4">
          Become a Contributor
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Help improve NΨ Cheatcode by contributing content for U of T
          Engineering Science students. We're looking for practice questions,
          roadmap improvements, and resource additions.
        </p>
      </header>

      {/* Purpose Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🎯 Purpose</h2>
        <div className="bg-blue-50 p-6 rounded-lg">
          <p className="text-gray-700">
            This platform is built for U of T Engineering Science students and
            organizes content into roadmaps, curated questions, cheatsheets, and
            process sheets. Contributors can help by identifying missing or
            incomplete content and submitting structured GitHub issues.
          </p>
        </div>
      </section>

      {/* Contribution Areas */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          ✅ Contribution Areas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-3">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <FaEdit className="text-blue-700 text-xl" />
              </div>
              <h3 className="text-xl font-semibold">Practice Questions</h3>
            </div>
            <p className="text-gray-600">
              Suggest additional practice problems for a specific topic node in
              a course roadmap.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-3">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <FaRoad className="text-blue-700 text-xl" />
              </div>
              <h3 className="text-xl font-semibold">Roadmap Fixes</h3>
            </div>
            <p className="text-gray-600">
              Propose changes to topic dependencies or missing topics in a
              course roadmap.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-3">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <FaFileAlt className="text-blue-700 text-xl" />
              </div>
              <h3 className="text-xl font-semibold">Missing Resources</h3>
            </div>
            <p className="text-gray-600">
              Report missing or broken cheatsheets, process sheets, or external
              links.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-3">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <FaExternalLinkAlt className="text-blue-700 text-xl" />
              </div>
              <h3 className="text-xl font-semibold">External References</h3>
            </div>
            <p className="text-gray-600">
              Share useful tools, notes, or tutorials to be included as external
              references.
            </p>
          </div>
        </div>
      </section>

      {/* How to Contribute */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          🗂️ How to Contribute
        </h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-700 mb-6">
            To contribute to NΨ Cheatcode, please create a{" "}
            <strong>GitHub issue</strong> following the template below. This
            helps us track and implement suggestions efficiently.
          </p>

          <div className="bg-gray-100 p-6 rounded-lg mb-6 font-mono text-sm">
            <p className="font-bold mb-4">📌 Contribution Template</p>
            <p className="mb-2">
              <span className="text-blue-600">Contribution Type</span>
              <br />
              (Practice Question / Roadmap Update / Cheatsheet Fix / External
              Link)
            </p>
            <p className="mb-2">
              <span className="text-blue-600">Course & Topic</span>
              <br />
              e.g., MAT194 – Integration by Parts
            </p>
            <p className="mb-2">
              <span className="text-blue-600">Details of Suggestion</span>
              <br />
              Describe the change, addition, or question clearly.
            </p>
            <p className="mb-2">
              <span className="text-blue-600">
                Optional Links or References
              </span>
              <br />
              Include any external resources or screenshots.
            </p>
          </div>

          <div className="flex justify-center">
            <a
              href="https://github.com/hanheelee/engsci-cheatcode/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-700 text-white px-6 py-3 rounded-md flex items-center hover:bg-blue-800 transition-colors"
            >
              <FaGithub className="mr-2" /> Submit a GitHub Issue
            </a>
          </div>
        </div>
      </section>

      {/* Additional Info */}
      <section>
        <div className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            💡 Additional Information
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>
              All contributions will be reviewed by our team before being added
              to the platform.
            </li>
            <li>
              Please be specific about the course, topic, and nature of your
              contribution.
            </li>
            <li>
              For large contributions or if you'd like to join the development
              team, please reach out directly via the Contact information in the
              footer.
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Contribute;

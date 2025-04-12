import React from "react";

const Internship = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Internship & Experience Guide
      </h1>
      <p className="text-gray-600 mb-8">
        A resource hub for Engineering Science students looking to find
        internships, research positions, or build personal projects during their
        first two years.
      </p>

      <div className="space-y-12">
        {/* Where to Start Section */}
        <section id="section-start" className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-800 mb-2">
            🔰 Where to Start
          </h2>
          <p className="text-slate-700 text-sm">
            Experience doesn't always mean internships. Here's how to build
            credibility even without a formal title.
          </p>
          <ul className="ml-4 list-disc text-sm text-slate-700 space-y-2">
            <li>Volunteer in a research lab (even if unpaid)</li>
            <li>Cold-email a startup or professor</li>
            <li>Build a project on GitHub</li>
            <li>Participate in hackathons</li>
            <li>Document what you learn</li>
          </ul>
        </section>

        {/* Pathways to Experience Section */}
        <section id="section-pathways" className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-800 mb-2">
            🧭 Pathways to Experience
          </h2>
          <p className="text-slate-700 text-sm mb-4">
            Different ways to gain valuable experience and build your resume.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
              <h3 className="font-medium text-slate-800 mb-2">
                Academic Research
              </h3>
              <p className="text-slate-600 text-sm">
                ESROP, NSERC, and Mitacs programs offer structured research
                opportunities with faculty.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
              <h3 className="font-medium text-slate-800 mb-2">Startups</h3>
              <p className="text-slate-600 text-sm">
                Early-stage companies often need technical help and provide
                hands-on experience.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
              <h3 className="font-medium text-slate-800 mb-2">
                Personal Projects
              </h3>
              <p className="text-slate-600 text-sm">
                Self-directed work demonstrates initiative and builds a
                portfolio to show employers.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
              <h3 className="font-medium text-slate-800 mb-2">
                Industry Internships
              </h3>
              <p className="text-slate-600 text-sm">
                Formal programs through CLNx and company websites for structured
                experience.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
              <h3 className="font-medium text-slate-800 mb-2">Competitions</h3>
              <p className="text-slate-600 text-sm">
                Hackathons, case competitions, and design challenges build
                skills and network.
              </p>
            </div>
          </div>
        </section>

        {/* Cold Email Toolkit Section */}
        <section id="section-email" className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-800 mb-2">
            📬 Cold Email Toolkit
          </h2>
          <p className="text-slate-700 text-sm mb-4">
            This is the most powerful strategy students overlook.
          </p>
          <div className="bg-slate-100 p-4 rounded-md font-mono text-sm whitespace-pre-wrap">
            {`📧 Cold Email Template

Subject: EngSci student interested in [your lab/project]

Hi [Prof/Founder Name],

I'm a [year] Engineering Science student at U of T exploring [relevant interest]. I came across your [paper/project/startup] and was impressed by your work on [specific topic].

I'm looking to get hands-on experience, and would love the opportunity to contribute—even as a volunteer. I have some background in [relevant skill or course], and I'm eager to learn.

Would you be open to a quick chat, or can I send you my resume?

Thanks so much,  
[Your Name]  
[LinkedIn / GitHub / Resume link]`}
          </div>
        </section>

        {/* How to Start a Project Section */}
        <section id="section-projects" className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-800 mb-2">
            🧠 Build Your Own Project
          </h2>
          <p className="text-slate-700 text-sm mb-2">
            Creating your own projects is an excellent way to demonstrate skills
            and interests.
          </p>
          <ul className="ml-4 list-disc text-sm text-slate-700 space-y-2">
            <li>Start small: build a website, script, or visualization</li>
            <li>Use public APIs (weather, sports, finance)</li>
            <li>Share your work on GitHub or Notion</li>
            <li>Tie projects to your major interest (MI, ROB, etc.)</li>
            <li>Use platforms like GitHub Pages, Netlify, Render</li>
          </ul>
        </section>

        {/* Research Programs Section */}
        <section id="section-research" className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-800 mb-2">
            🧪 Undergraduate Research Programs
          </h2>
          <p className="text-slate-700 text-sm mb-4">
            Structured research opportunities for undergraduate students.
          </p>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <h3 className="font-medium text-slate-800">ESROP</h3>
              <p className="text-slate-600 text-sm">
                U of T's Engineering Science Research Opportunities Program.
                Work with faculty during the summer on exciting research
                projects.
              </p>
              <a
                href="https://engsci.utoronto.ca/research-and-entrepreneurship/research/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                Learn more →
              </a>
            </div>
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <h3 className="font-medium text-slate-800">NSERC USRA</h3>
              <p className="text-slate-600 text-sm">
                Nationally funded Undergraduate Student Research Awards that
                provide stipends for 16-week research assistantships.
              </p>
              <a
                href="https://www.engineering.utoronto.ca/research-innovation/undergraduate-research-opportunities/nserc-undergraduate-student-research-awards-usra/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                Learn more →
              </a>
            </div>
            <div className="border-l-4 border-purple-500 pl-4 py-2">
              <h3 className="font-medium text-slate-800">Mitacs Globalink</h3>
              <p className="text-slate-600 text-sm">
                International research fellowships that connect students with
                research projects abroad.
              </p>
              <a
                href="https://www.mitacs.ca/en/programs/globalink"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                Learn more →
              </a>
            </div>
          </div>
        </section>

        {/* Resource Library Section */}
        <section id="section-resources" className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-800 mb-2">
            🧰 Best Tools & Resources
          </h2>
          <p className="text-slate-700 text-sm mb-4">
            Helpful tools and platforms to support your job search, project
            development, and more.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-white p-3 rounded border border-slate-200">
              <h3 className="font-medium text-slate-800 text-sm">Job Boards</h3>
              <ul className="text-slate-600 text-xs mt-1 space-y-1">
                <li>CLNx</li>
                <li>AngelList</li>
                <li>Work at a Startup</li>
              </ul>
            </div>
            <div className="bg-white p-3 rounded border border-slate-200">
              <h3 className="font-medium text-slate-800 text-sm">Resume</h3>
              <ul className="text-slate-600 text-xs mt-1 space-y-1">
                <li>Overleaf</li>
                <li>Resumake.io</li>
                <li>LaTeX templates</li>
              </ul>
            </div>
            <div className="bg-white p-3 rounded border border-slate-200">
              <h3 className="font-medium text-slate-800 text-sm">Projects</h3>
              <ul className="text-slate-600 text-xs mt-1 space-y-1">
                <li>GitHub</li>
                <li>Netlify</li>
                <li>Replit</li>
              </ul>
            </div>
            <div className="bg-white p-3 rounded border border-slate-200">
              <h3 className="font-medium text-slate-800 text-sm">Hackathons</h3>
              <ul className="text-slate-600 text-xs mt-1 space-y-1">
                <li>Devpost</li>
                <li>MLH</li>
                <li>Eventbrite</li>
              </ul>
            </div>
            <div className="bg-white p-3 rounded border border-slate-200">
              <h3 className="font-medium text-slate-800 text-sm">
                Email Tools
              </h3>
              <ul className="text-slate-600 text-xs mt-1 space-y-1">
                <li>Mailtrack</li>
                <li>Notion CRM</li>
                <li>Email trackers</li>
              </ul>
            </div>
            <div className="bg-white p-3 rounded border border-slate-200">
              <h3 className="font-medium text-slate-800 text-sm">Learning</h3>
              <ul className="text-slate-600 text-xs mt-1 space-y-1">
                <li>Coursera</li>
                <li>edX</li>
                <li>YouTube tutorials</li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-slate-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-slate-800 mb-2">
            🚀 Take Action Now
          </h2>
          <p className="text-slate-700 text-sm mb-6">
            Ready to take the next step? Use these resources to get started
            right away.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="https://www.notion.so/templates/cold-email-template"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700 transition text-center"
            >
              Generate Cold Email
            </a>
            <a
              href="https://github.com/new"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-700 text-white px-4 py-2 rounded hover:bg-slate-800 transition text-center"
            >
              Plan Your First Project
            </a>
            <a
              href="https://discord.gg/engineering"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition text-center"
            >
              Join Discord for Feedback
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Internship;

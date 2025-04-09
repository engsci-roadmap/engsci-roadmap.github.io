const Terms = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Terms of Service
      </h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
        <p className="text-gray-700 mb-6">
          Welcome to EngSci Roadmap. By accessing this website, you agree to be
          bound by these Terms of Service and all applicable laws. If you do not
          agree, please refrain from using the site.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">2. Educational Purpose</h2>
        <p className="text-gray-700 mb-6">
          This platform is intended solely for academic and personal use by
          Engineering Science students at the University of Toronto. All content
          is provided for educational purposes only.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">3. Intellectual Property</h2>
        <p className="text-gray-700 mb-6">
          Unless otherwise stated, all materials—such as roadmaps, solutions,
          and interface designs—are the intellectual property of the site
          creators or contributors. You may not redistribute, copy, or
          commercially use any material without written permission.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          4. User-Contributed Content
        </h2>
        <p className="text-gray-700 mb-6">
          Any content submitted by users (e.g., hints, answers, resources) must
          be original or properly attributed. We reserve the right to remove or
          modify content and are not responsible for the accuracy of user
          submissions.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">5. Disclaimers</h2>
        <p className="text-gray-700 mb-6">
          This website and its contents are provided "as is" without warranty of
          any kind. We make no guarantees about the accuracy, completeness, or
          availability of any materials. You use the platform at your own risk.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          6. Limitations of Liability
        </h2>
        <p className="text-gray-700 mb-6">
          In no event shall the creators of this platform be liable for any
          indirect, incidental, or consequential damages arising from the use of
          or inability to use this website or its content.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">7. External Links</h2>
        <p className="text-gray-700 mb-6">
          We are not responsible for the content or practices of any external
          websites linked from this platform.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">8. Governing Law</h2>
        <p className="text-gray-700 mb-6">
          These terms are governed by the laws of the Province of Ontario,
          Canada. Any disputes shall be resolved under the jurisdiction of
          Ontario courts.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          9. Changes to These Terms
        </h2>
        <p className="text-gray-700 mb-6">
          We may update these Terms at any time. Continued use of the platform
          constitutes acceptance of the updated terms and conditions.
        </p>
      </section>

      <p className="text-sm text-gray-500 mt-12 border-t pt-6">
        Last updated: {new Date().toLocaleDateString()}
      </p>
    </div>
  );
};

export default Terms;

import { FaLinkedin, FaGithub, FaEnvelope, FaDiscord } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Links Section */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/y1f" className="text-gray-400 hover:text-white">
                  Y1F
                </Link>
              </li>
              <li>
                <Link to="/y1w" className="text-gray-400 hover:text-white">
                  Y1W
                </Link>
              </li>
              <li>
                <Link to="/y2f" className="text-gray-400 hover:text-white">
                  Y2F
                </Link>
              </li>
              <li>
                <Link to="/y2w" className="text-gray-400 hover:text-white">
                  Y2W
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Section */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Social</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://linkedin.com/in/lee-hanhee"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white flex items-center"
                >
                  <FaLinkedin className="mr-2" /> LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/lee-hanhee"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white flex items-center"
                >
                  <FaGithub className="mr-2" /> GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://discord.com/users/hylee26"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white flex items-center"
                >
                  <FaDiscord className="mr-2" /> Discord
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Contact</h3>
            <a
              href="mailto:hanhee@hotmail.ca"
              className="text-gray-400 hover:text-white flex items-center"
            >
              <FaEnvelope className="mr-2" /> hanhee@hotmail.ca
            </a>
          </div>

          {/* Legal Section */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Legal</h3>
            <Link to="/terms" className="text-gray-400 hover:text-white">
              Terms of Service
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-4 border-t border-gray-700">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} EngSci Roadmap. All rights reserved.
          </p>
          <p className="text-xs text-gray-500 mt-1">
            All content on this site is protected by copyright law. Unauthorized
            use, reproduction, or distribution is prohibited.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

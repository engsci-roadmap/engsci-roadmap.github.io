const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">
              © {new Date().getFullYear()} EngSci Cheatcode. All rights
              reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-white">
              Terms
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              Privacy
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

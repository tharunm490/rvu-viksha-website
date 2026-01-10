import { Instagram, Linkedin, Github, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="px-4 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 mb-6 justify-items-center">
            {/* Brand section */}
            <div className="md:col-span-1 w-full max-w-xs">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-16 h-16 rounded-3xl flex items-center justify-center">
                  <img
                    src="/assets/Viksha2.jpg"
                    alt="Viksha Coding Club Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">VIKSHA CODING CLUB OF RVU</h4>
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Empowering coders through collaboration, innovation, and continuous learning.
              </p>
            </div>

            {/* Contact Information */}
            <div className="w-full max-w-xs">
              <h4 className="font-semibold mb-2 text-lg flex items-center">
                <MapPin className="mr-2 h-5 w-5 text-blue-400" />
                Contact Information
              </h4>
              <a
                href="https://maps.app.goo.gl/YourRVUniversityMapLink"
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-blue-400 transition-colors cursor-pointer"
              >
                <p className="text-gray-400 text-sm mb-1 hover:text-blue-400 transition-colors">RV University, RV Vidyanikethan Post,</p>
                <p className="text-gray-400 text-sm mb-1 hover:text-blue-400 transition-colors">8th Mile, Mysore Rd,</p>
                <p className="text-gray-400 text-sm mb-1 hover:text-blue-400 transition-colors">Mailasandra, Bengaluru,</p>
                <p className="text-gray-400 text-sm hover:text-blue-400 transition-colors">Karnataka 560059</p>
              </a>
            </div>

            {/* Social Links */}
            <div className="w-full max-w-xs">
              <h4 className="font-semibold mb-2 text-lg">Follow Us</h4>
              <p className="text-gray-400 text-sm mb-4">
                Stay connected with us on social media for updates and events.
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://www.instagram.com/viksha_rvu?igsh=eXY3OGN4dTY2aG1z"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 hover:bg-gradient-to-r hover:from-purple-700 hover:to-blue-600 p-3 rounded-full transition-all duration-300 transform hover:-translate-y-1"
                  aria-label="Visit our Instagram"
                >
                  <Instagram size={20} className="text-gray-300" />
                </a>
                <a
                  href="https://www.linkedin.com/company/viksha/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-500 p-3 rounded-full transition-all duration-300 transform hover:-translate-y-1"
                  aria-label="Visit our LinkedIn"
                >
                  <Linkedin size={20} className="text-gray-300" />
                </a>
                <a
                  href="https://github.com/viksha-club-rvu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-900 p-3 rounded-full transition-all duration-300 transform hover:-translate-y-1"
                  aria-label="Visit our GitHub"
                >
                  <Github size={20} className="text-gray-300" />
                </a>
                <a
                  href="mailto:club_viksha@rvu.edu.in"
                  className="bg-gray-800 hover:bg-gradient-to-r hover:from-red-600 hover:to-orange-500 p-3 rounded-full transition-all duration-300 transform hover:-translate-y-1"
                  aria-label="Email us"
                >
                  <Mail size={20} className="text-gray-300" />
                </a>
              </div>
            </div>
          </div>

          {/* Copyright section */}
          <div className="border-t border-gray-800 pt-4 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; 2025 Viksha Coding Club. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Code of Conduct</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
import React from 'react';
import { Code2, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full bg-[#0d1117]/80 backdrop-blur-xl border-t border-white/5 pt-16 pb-8 px-6 lg:px-12 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-10">

        {/* Brand Section */}
        <div className="flex flex-col gap-4 max-w-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <Code2 size={24} className="text-orange-500" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white drop-shadow-sm">DevTinder</span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            The ultimate platform for finding your next project collaborator or coding buddy. Seamless matchmaking for engineers globally.
          </p>
        </div>

        {/* Links Section */}
        <div className="flex gap-16 sm:gap-24">
          <div className="flex flex-col gap-3">
            <h6 className="text-white font-semibold tracking-wide text-sm mb-2 uppercase opacity-80">Platform</h6>
            <a className="text-gray-400 hover:text-white transition-colors text-sm cursor-pointer">Explore Developers</a>
            <a className="text-gray-400 hover:text-white transition-colors text-sm cursor-pointer">Projects</a>
            <a className="text-gray-400 hover:text-white transition-colors text-sm cursor-pointer">Pricing</a>
          </div>
          <div className="flex flex-col gap-3">
            <h6 className="text-white font-semibold tracking-wide text-sm mb-2 uppercase opacity-80">Company</h6>
            <a className="text-gray-400 hover:text-white transition-colors text-sm cursor-pointer">About Us</a>
            <a className="text-gray-400 hover:text-white transition-colors text-sm cursor-pointer">Careers</a>
            <a className="text-gray-400 hover:text-white transition-colors text-sm cursor-pointer">Terms & Privacy</a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} DevTinder Inc. All rights reserved.
        </p>
        <div className="flex items-center gap-5">
          <a className="text-gray-400 hover:text-orange-400 transition-colors cursor-pointer">
            <Github size={20} />
          </a>
          <a className="text-gray-400 hover:text-orange-400 transition-colors cursor-pointer">
            <Twitter size={20} />
          </a>
          <a className="text-gray-400 hover:text-orange-400 transition-colors cursor-pointer">
            <Linkedin size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

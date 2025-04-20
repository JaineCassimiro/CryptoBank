import { Shield } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-neutral-200 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-pink-500" />
              <span className="font-heading font-bold text-lg text-neutral-800">CryptoBank</span>
            </div>
            <p className="text-sm text-neutral-500 mt-1">Your data protected by advanced encryption</p>
          </div>
          
          <div className="flex flex-col items-center md:items-end">
            <div className="flex space-x-4 mb-3">
              <a href="#" className="text-neutral-500 hover:text-pink-500 transition-colors">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-neutral-500 hover:text-pink-500 transition-colors">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-neutral-500 hover:text-pink-500 transition-colors">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-neutral-500 hover:text-pink-500 transition-colors">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
            <p className="text-sm text-neutral-500">© {new Date().getFullYear()} CryptoBank. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

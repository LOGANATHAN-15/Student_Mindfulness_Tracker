import { Heart } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-100 py-8 mt-auto">
            <div className="container mx-auto px-4 text-center">
                <div className="flex items-center justify-center space-x-2 text-gray-400 mb-4">
                    <span>Made with</span>
                    <Heart size={16} className="text-red-400 fill-current" />
                    <span>for your wellness</span>
                </div>
                <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
                    <span className="font-semibold block mb-1">Medical Disclaimer</span>
                    This system is for wellness support only and does not provide medical diagnosis, treatment, or professional advice. Please consult with a healthcare professional for medical concerns.
                </p>
                <p className="text-xs text-gray-300 mt-4">
                    © {new Date().getFullYear()} MindfulTrack. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;

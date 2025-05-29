import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import logo from '../assets/wps2.png';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 font-sans">
      {/* Glass Hero Section */}
      <header className="relative py-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[#de7225] sidebar opacity-95"></div>
        <div className="relative max-w-5xl mx-auto z-10">
          <div className="flex flex-col items-center justify-center mb-10">
            <div className="w-40 h-40 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border-2 border-white/30">
              <img src={logo} alt="Logo" className="w-32 h-32 object-contain" />
            </div>
            <div className="mt-6 text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-md">
                West African Postgraduate College of Pharmacists
              </h1>
              <p className="text-md md:text-lg italic text-white/90 mt-2">
                Collège de Troisième Cycle des Pharmaciens de l'Afrique de l'Ouest
              </p>
            </div>
          </div>
          
          <p className="mt-6 text-white/90 text-lg max-w-2xl mx-auto">
            Modern logbook platform for Postgraduate Pharmacist Students in West Africa
          </p>
          
          <div className="mt-10 flex justify-center gap-6">
            <Link to="/login">
              <Button 
                variant="contained" 
                className="bg-white/90 hover:bg-white text-[#de7225] px-8 py-2 rounded-full shadow-lg transition-all hover:scale-105"
                sx={{
                    backgroundColor: 'white',
                    color: '#de7225',
                    '&:hover': {
                        backgroundColor: '#f5f5f5',
                        transform: 'scale(1.05)'
                    },
                    px: 4,
                    py: 1.5,
                    borderRadius: '999px',
                    boxShadow: 2
                    }}
              >
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button 
                variant="contained"
                
                className="bg-black/90 hover:bg-black text-white px-8 py-2 rounded-full shadow-lg transition-all hover:scale-105"
              sx={{
                backgroundColor: '#1a1a1a', // Dark gray/black
                color: 'white',
                '&:hover': {
                    backgroundColor: '#2a2a2a',
                    transform: 'scale(1.05)'
                },
                px: 4,
                py: 1.5,
                borderRadius: '999px',
                boxShadow: 2
                }}
              >

                
                Register
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Glass Features Section */}
      <section className="py-16 px-6 max-w-6xl mx-auto -mt-16 relative z-20">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 md:p-12">
          <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">About the Platform</h2>
          <p className="text-gray-600 text-center max-w-3xl mx-auto mb-12">
            Digital solution for recording, managing, and tracking clinical activities 
            across West African institutions with academic precision.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Secure Access",
                desc: "Role-based authentication with encrypted data"
              },
              {
                title: "Activity Tracking",
                desc: "Log competencies with timestamps"
              },
              {
                title: "PDF Export",
                desc: "Generate professional reports"
              },
              {
                title: "Mobile Ready",
                desc: "Fully responsive interface"
              }
            ].map((feature, i) => (
              <div 
                key={i} 
                className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <FaCheckCircle className="text-[#de7225] text-xl" />
                  <h3 className="font-semibold text-gray-800">{feature.title}</h3>
                </div>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Glass Footer */}
      <footer className="py-12 px-6 bg-white/80 backdrop-blur-md mt-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-xl font-semibold mb-6">Ready to transform your logbook experience?</h2>
          <div className="flex justify-center gap-4 mb-8">
            <Link to="/login">
              <Button 
                variant="contained" 
                className="bg-[#de7225] hover:bg-[#c5611d] text-white px-8 py-2 rounded-full shadow-md"
                sx={{
                    backgroundColor: '#de7225',
                    color: 'white',
                    '&:hover': {
                        backgroundColor: '#a44a0e',
                        transform: 'scale(1.05)'
                    },
                    px: 4,
                    py: 1.5,
                    borderRadius: '999px',
                    boxShadow: 2
                    }}
              >
                Get Started
              </Button>
            </Link>
          </div>
          <div className="border-t border-gray-200 pt-6">
            <p className="text-gray-600">
              Contact us at <a href="mailto:info@wapcp.org" className="text-[#de7225] hover:underline">info@logbookapp.com</a>
            </p>
            <p className="text-sm text-gray-500 mt-2">
              © {new Date().getFullYear()} WAPCP. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
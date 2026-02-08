import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, ShieldCheck, ArrowRight } from "lucide-react";
import Hyperspeed from '../components/hs';
import TiltedCard from '../components/TiltedCard';
import studentLogo from "./studentlogoo.png"
import TextType from "../components/typewriter";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] relative flex items-center justify-center antialiased overflow-hidden">
      
      {/* Background Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none w-full h-full">
        <Hyperspeed
          effectOptions={{
            "distortion": "turbulentDistortion",
            "length": 400,
            "roadWidth": 10,
            "islandWidth": 2,
            "lanesPerRoad": 3,
            "fov": 120,
            "fovSpeedUp": 150,
            "speedUp": 2,
            "carLightsFade": 0.4,
            "totalSideLightSticks": 20,
            "lightPairsPerRoadWay": 40,
            "shoulderLinesWidthPercentage": 0.05,
            "brokenLinesWidthPercentage": 0.1,
            "brokenLinesLengthPercentage": 0.5,
            "lightStickWidth": [0.12, 0.5],
            "lightStickHeight": [1.3, 1.7],
            "movingAwaySpeed": [60, 80],
            "movingCloserSpeed": [-120, -160],
            "carLightsLength": [12, 80],
            "carLightsRadius": [0.05, 0.14],
            "carWidthPercentage": [0.3, 0.5],
            "carShiftX": [-0.8, 0.8],
            "carFloorSeparation": [0, 5],
            "colors": {
              "roadColor": 0x080808,
              "islandColor": 0x0a0a0a,
              "background": 0x000000,
              "shoulderLines": 0x131318,
              "brokenLines": 0x131318,
              "leftCars": [0xd856bf, 0x6750a2, 0xc247ac],
              "rightCars": [0x03b3c3, 0x0e5ea5, 0x324555],
              "sticks": 0x03b3c3
            }
          }}
        />
      </div>

      {/* Content Layer */}
      <div className="relative z-20 w-full flex flex-col items-center justify-center px-4 py-8">
        
        {/* Main Title - Centered */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-center mb-20 md:mb-20 relative z-20 w-full"
        >
          {/* OD-TRACKER with Typewriter Effect - LARGER FONT */}
          <div className="text-white uppercase tracking-[0.8em] md:tracking-[0.8em] text-base md:text-lg lg:text-xl font-black mt-10 md:mt-10">
            <TextType 
              text={["OD-TRACKER"]}
              typingSpeed={75}
              initialDelay={500}
              pauseDuration={2000}
              loop={false}
              className="text-glow"
              showCursor={false}
            />
          </div>
          
          {/* Chennai Institute of Technology with Typewriter Effect */}
          <div className="text-white uppercase tracking-[0.3em] md:tracking-[0.4em] text-base md:text-lg lg:text-xl font-black mt-8 md:mt-10">
            <TextType 
              text={["Chennai Institute of Technology"]}
              typingSpeed={50}
              initialDelay={1500} // Start after OD-TRACKER finishes
              pauseDuration={3000}
              loop={false}
              className="text-glow-sm font-outline-sm"
              showCursor={false}
            />
          </div>
        </motion.div>

        {/* Cards Container - Horizontal */}
        <div className="flex flex-row flex-wrap justify-center gap-6 md:gap-10 items-center w-full max-w-7xl">
          
          {/* Student Card */}
          <motion.div 
            className="cursor-pointer"
            onClick={() => navigate("/Studentpage")}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.5 }} // Start after both texts finish typing
          >
            <TiltedCard
              imageSrc={studentLogo}
              containerHeight="420px"
              containerWidth="600px"
              imageHeight="420px"
              imageWidth="400px"
              rotateAmplitude={12}
              scaleOnHover={1.05}
              showTooltip={false}
              showMobileWarning={false}
              displayOverlayContent={true}
              overlayContent={
                <div className="w-[390px] h-[400px] p-8 rounded-2xl bg-gradient-to-br from-black/80 to-gray-900/80 backdrop-blur-xl flex flex-col items-center justify-center text-center shadow-2xl">
                  <div className="relative">
                    <GraduationCap className="text-blue-500 mb-4" size={56} />
                    <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"></div>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2 uppercase">Student Portal</h2>
                  <p className="text-gray-300 text-sm mb-6 px-4">Apply and track your On-Duty requests in real-time.</p>
                  <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-widest bg-black/40 px-4 py-2 rounded-full">
                    Enter Portal <ArrowRight size={14} />
                  </div>
                </div>
              }
            />
          </motion.div>

          {/* Faculty Card */}
          <motion.div 
            className="cursor-pointer"
            onClick={() => navigate("/facultypage")}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.8 }} // Slightly staggered after student card
          >
            <TiltedCard
              imageSrc={studentLogo}
              containerHeight="420px"
              containerWidth="600px"
              imageHeight="420px"
              imageWidth="400px"
              rotateAmplitude={12}
              scaleOnHover={1.05}
              showTooltip={false}
              showMobileWarning={false}
              displayOverlayContent={true}
              overlayContent={
                <div className="w-[390px] h-[400px] p-8 rounded-2xl bg-gradient-to-br from-black/80 to-gray-900/80 backdrop-blur-xl flex flex-col items-center justify-center text-center shadow-2xl">
                  <div className="relative">
                    <ShieldCheck className="text-purple-500 mb-4" size={56} />
                    <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full"></div>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2 uppercase">Faculty Portal</h2>
                  <p className="text-gray-300 text-sm mb-6 px-4">Review, verify, and approve pending OD applications.</p>
                  <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-widest bg-black/40 px-4 py-2 rounded-full">
                    Access Panel <ArrowRight size={14} />
                  </div>
                </div>
              }
            />
          </motion.div>

        </div>
      </div>
    </div>
  );
}
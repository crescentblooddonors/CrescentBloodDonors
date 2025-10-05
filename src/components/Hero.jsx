import React from 'react';

const HeroSection = () => {
  return (
    <section className="w-screen h-screen relative bg-red-500 font-poppins overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute top-0 right-0 w-1/3 h-1/2 -z-1 opacity-70">
         <img src="/assets/corner-ill.png" alt="Top right decoration" className="object-contain" />
      </div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/3 -z-1 opacity-70">
         <img src="/assets/bot-corner-ill.png" alt="Bottom left decoration" className="object-contain"/>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center">

          {/* Left Content */}
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-dark-blue uppercase leading-tight">
              Donate Blood,<br />
              Save Lives
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Connecting donors with those in need instantly
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex justify-center md:justify-start space-x-4">
              <a
                href="#"
                className="px-8 py-3 bg-primary-red text-white font-bold rounded-full shadow-lg hover:bg-red-700 transition-transform transform hover:-translate-y-1"
              >
                Become a Donor
              </a>
              <a
                href="#"
                className="px-8 py-3 text-dark-blue font-bold border-2 border-primary-red rounded-full hover:bg-primary-red hover:text-white transition-colors"
              >
                Need Blood
              </a>
            </div>

            {/* Playstore Link */}
            <div className="mt-8 flex items-center justify-center md:justify-start text-gray-500">
              <i className="fab fa-google-play text-2xl mr-3 text-primary-red"></i>
              <span className="font-medium">Playstore Link ( Coming Soon )</span>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="w-full md:w-1/2 mt-12 md:mt-0">
            <img
              src="/assets/Blood donation-ill.png"
              alt="Nurse with blood donor"
              className="mx-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

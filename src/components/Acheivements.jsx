import React, { useState, useEffect } from "react";
import { api } from "../config/Url";

const staticAchievementsData = [
  {
    icon: "fa-car",
    title: "Traffic Awareness Camp",
    color: "text-blue-600",
    description: [
      "Launched the new academic year with an impactful Traffic Awareness Camp, led by the boys’ team, to promote road safety and social responsibility.",
      "The campaign reminded commuters that “Every move behind the wheel matters — drive with care, choose responsibility.”",
      "Participants engaged the public through interactive demonstrations, placards, and awareness talks under the guidance of the Traffic Police Department.",
      "The initiative included a bilingual road safety pledge (Tamil & English), emphasizing the importance of helmets, seatbelts, sobriety, and first aid awareness through the Good Samaritan initiative.",
    ],
  },
  {
    icon: "fa-child",
    title: "Children’s Day Out",
    color: "text-green-500",
    description: [
      "A heartfelt celebration of joy, learning, and compassion, reflecting CBD’s belief that kindness goes beyond blood donation.",
      "The event brought together 75 children from three orphanages: Golden Heart Foundation, Nanthavanam Girls Shelter Home, and Rainbow Nest Boys Home.",
      "The outing was successfully managed by 25 volunteers and 15 caretakers.",
      "Activities included exploring the zoo, enjoying games, and sharing meals, all arranged by the CBD team.",
    ],
  },
  {
    icon: "fa-trophy",
    title: "Founder's Day Blood Donation Camp",
    color: "text-red-600",
    description: [
      "A resounding success organized by Crescent Blood Donors (CBD) in collaboration with the BSA Crescent Alumni Association, Rajiv Gandhi Government General Hospital, and HDFC Bank.",
      "The event recorded an impressive 450 registrations and 311 successful donations, showcasing the community’s strong spirit of volunteerism.",
      "This milestone reaffirmed the institute’s unwavering commitment to humanitarian service and community welfare.",
    ],
  },
];

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await api.get("/achievements");
        if (response.data && response.data.success && response.data.data.length > 0) {
          setAchievements(response.data.data);
        } else {
          setAchievements(staticAchievementsData);
        }
      } catch (error) {
        console.error("Failed to fetch achievements:", error);
        setAchievements(staticAchievementsData);
      }
    };
    fetchAchievements();
  }, []);

  return (
    <section className="bg-slate-50/50  font-poppins relative overflow-hidden">
      {/* Soft blur visual details */}
      <div className="absolute top-1/3 left-0 w-80 h-80 bg-red-50/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-1/3 right-0 w-80 h-80 bg-blue-50/20 rounded-full blur-3xl -z-10"></div>

      <div className="mx-auto px-6 max-w-5xl">
        <div className="text-center mb-16">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-50 text-red-600 border border-red-100 uppercase tracking-wider">Milestones</span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#153F76] uppercase mt-3">
            Achievements
          </h2>
          <p className="mt-4 text-base text-slate-500 max-w-2xl mx-auto">
            A testament to our hard work, dedication, and the milestones we have reached together.
          </p>
        </div>

        {/* Vertical Timeline Track */}
        <div className="relative">
          {/* Vertical central divider line (desktop only) */}
          <div className="absolute left-1/2 -translate-x-1/2 top-4 bottom-4 w-0.5 bg-slate-200 hidden md:block"></div>

          <div className="space-y-12 md:space-y-16">
            {achievements.map((item, index) => {
              const isEven = index % 2 === 0;
              const getIconBg = (colorClass) => {
                if (colorClass.includes('blue')) return 'bg-blue-50';
                if (colorClass.includes('green')) return 'bg-green-50';
                if (colorClass.includes('red')) return 'bg-red-50';
                return 'bg-slate-50';
              };

              return (
                <div
                  key={item._id || index}
                  className={`flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0 relative ${isEven ? '' : 'md:flex-row-reverse'
                    }`}
                >
                  {/* Timeline Card */}
                  <div className="w-full md:w-[45%] group">
                    <div className="bg-white border border-slate-100 hover:border-slate-200/80 p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative">

                      {/* Timeline connection pointer */}
                      <div className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-slate-200 rounded-full hidden md:block ${isEven ? '-right-[29px]' : '-left-[29px]'
                        } z-10 group-hover:border-red-500 group-hover:bg-red-500 transition-all duration-200`}></div>

                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${getIconBg(item.color || 'text-red-600')} ${item.color || 'text-red-600'} shrink-0`}>
                          <i className={`fas ${item.icon.startsWith('fa-') ? item.icon : `fa-${item.icon}`}`}></i>
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 group-hover:text-[#153F76] transition-colors mb-0">{item.title}</h3>
                      </div>

                      <ul className="space-y-3 pl-1">
                        {item.description.map((point, pIdx) => (
                          <li key={pIdx} className="flex items-start gap-2.5 text-sm text-slate-500 leading-relaxed text-justify">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0"></span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Centered Node Number Index */}
                  <div className="absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center font-bold text-xs text-slate-400 hidden md:flex z-20 hover:border-red-500 hover:text-red-500 transition-all duration-200 shadow-sm">
                    {index + 1}
                  </div>

                  {/* Spacer placeholder side */}
                  <div className="hidden md:block w-[45%]"></div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Achievements;


import React, { useState, useEffect } from "react";
import { api } from "../config/Url";

const staticServicesData = [
  {
    icon: "fa-utensils",
    title: "Food Donation Drives",
    color: "text-orange-500",
    description: [
      "Organize food distribution programs to provide meals for underprivileged individuals, especially during festivals and community events.",
    ],
  },
  {
    icon: "fa-hands-helping",
    title: "Social Service Activities",
    color: "text-purple-500",
    description: [
      "Host traffic awareness campaigns to promote road safety and responsible behavior.",
      "Celebrate national and special days with events aimed at social upliftment.",
    ],
  },
  {
    icon: "fa-users",
    title: "Community Building",
    color: "text-teal-500",
    description: [
      "Encourage students to take active roles in social initiatives, building a strong network of changemakers.",
    ],
  },
];

const ServiceCard = ({ icon, title, description, color }) => {
  const getIconBg = (colorClass) => {
    if (colorClass.includes('orange')) return 'bg-orange-50';
    if (colorClass.includes('purple')) return 'bg-purple-50';
    if (colorClass.includes('teal')) return 'bg-teal-50';
    if (colorClass.includes('blue')) return 'bg-blue-50';
    if (colorClass.includes('red')) return 'bg-red-50';
    return 'bg-slate-50';
  };

  return (
    <div className="group bg-white border border-slate-100 hover:border-slate-200/80 p-8 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${getIconBg(color)} ${color} transition-all duration-300 group-hover:scale-110 mb-6 mx-auto`}>
          <i className={`fas ${icon.startsWith('fa-') ? icon : `fa-${icon}`}`}></i>
        </div>
        <h3 className="text-xl font-extrabold text-slate-800 group-hover:text-[#153F76] transition-colors mb-4 text-center">{title}</h3>
        <ul className="space-y-3 pl-1">
          {description.map((point, index) => (
            <li key={index} className="flex items-start gap-2.5 text-sm text-slate-500 leading-relaxed text-justify">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0"></span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const WhatWeDo = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get("/what-we-do");
        if (response.data && response.data.success && response.data.data.length > 0) {
          setServices(response.data.data);
        } else {
          setServices(staticServicesData);
        }
      } catch (error) {
        console.error("Failed to fetch what-we-do services:", error);
        setServices(staticServicesData);
      }
    };
    fetchServices();
  }, []);

  return (
    <section className="bg-slate-50/50 py-20 sm:py-24 font-poppins relative overflow-hidden">
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-red-50/10 rounded-full blur-3xl -z-10"></div>
      <div className="mx-auto px-6 max-w-6xl">
        <div className="text-center mb-16">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-50 text-red-600 border border-red-100 uppercase tracking-wider">Our Focus</span>
          <h2 className="text-3xl sm:text-4xl font-black text-dark-blue uppercase mt-3">
            What We Do
          </h2>
          <p className="mt-4 text-base text-slate-500 max-w-2xl mx-auto">
            Our initiatives are focused on creating a positive impact in the
            community through various service-oriented activities.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={service._id || index} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatWeDo;


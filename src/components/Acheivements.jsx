import React from "react";

// Data for the services section
const servicesData = [
  {
    icon: "fa-car", // Changed icon to represent traffic/transportation
    title: "Traffic Awareness Camp",
    color: "text-blue-600", // Used a blue color for traffic theme
    description: [
      "Launched the new academic year with an impactful Traffic Awareness Camp, led by the boys’ team, to promote road safety and social responsibility.",
      "The campaign reminded commuters that “Every move behind the wheel matters — drive with care, choose responsibility.”",
      "Participants engaged the public through interactive demonstrations, placards, and awareness talks under the guidance of the Traffic Police Department.",
      "The initiative included a bilingual road safety pledge (Tamil & English), emphasizing the importance of helmets, seatbelts, sobriety, and first aid awareness through the Good Samaritan initiative.",
    ],
    stats: {
      theme: "Road Safety", // New statistic to highlight the theme
      collaboration: "Traffic Police",
    },
  },
  {
    icon: "fa-child", // Icon representing children/social event
    title: "Children’s Day Out",
    color: "text-green-500", // Used a green color for a joyful/compassion theme
    description: [
      "A heartfelt celebration of joy, learning, and compassion, reflecting CBD’s belief that kindness goes beyond blood donation.",
      "The event brought together 75 children from three orphanages: Golden Heart Foundation, Nanthavanam Girls Shelter Home, and Rainbow Nest Boys Home.",
      "The outing was successfully managed by 25 volunteers and 15 caretakers.",
      "Activities included exploring the zoo, enjoying games, and sharing meals, all arranged by the CBD team.",
    ],
    stats: {
      children: "75",
      volunteers: "25",
      locations: "3 Orphanages",
    },
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
    stats: {
      registrations: "450",
      donations: "311",
    },
  },
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

const ServiceCard = ({ icon, title, description, color }) => (
  <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col">
    <div className="flex items-center mb-4">
      <div className={`text-3xl mr-4 ${color}`}>
        <i className={`fas ${icon}`}></i>
      </div>
      <h3 className="text-xl font-bold text-dark-blue">{title}</h3>
    </div>
    <ul className="space-y-2 text-gray-600 list-disc list-inside flex-grow">
      {description.map((point, index) => (
        <li key={index} className="text-justify">{point}</li>
      ))}
    </ul>
  </div>
);

const OurServices = () => {
  return (
    <section className="bg-gray-50 py-16 sm:py-20 font-poppins">
      <div className="mx-auto px-4 sm:px-4 lg:px-3">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-dark-blue uppercase">
            What We Do
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Our initiatives are focused on creating a positive impact in the
            community through various service-oriented activities.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurServices;

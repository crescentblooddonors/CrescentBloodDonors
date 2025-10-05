import React from 'react';

// Data for the services section
const servicesData = [
  {
    icon: 'fa-tint',
    title: 'Blood Donation Drives',
    color: 'text-red-500',
    description: [
      'Organize regular blood donation camps in collaboration with hospitals and blood banks.',
      'Respond to urgent blood requirements by connecting donors and recipients during life-threatening situations.',
    ],
  },
  {
    icon: 'fa-bullhorn',
    title: 'Awareness Campaigns',
    color: 'text-blue-500',
    description: [
      'Conduct workshops and educational programs to spread awareness about the importance of blood donation.',
      'Dispel myths and provide accurate information to remove barriers to donation.',
    ],
  },
  {
    icon: 'fa-pencil-alt',
    title: 'Scribe Writing Services',
    color: 'text-green-500',
    description: [
      'Support visually impaired and differently-abled students by volunteering as scribes during their examinations.',
    ],
  },
  {
    icon: 'fa-utensils',
    title: 'Food Donation Drives',
    color: 'text-orange-500',
    description: [
      'Organize food distribution programs to provide meals for underprivileged individuals, especially during festivals and community events.',
    ],
  },
  {
    icon: 'fa-hands-helping',
    title: 'Social Service Activities',
    color: 'text-purple-500',
    description: [
      'Host traffic awareness campaigns to promote road safety and responsible behavior.',
      'Celebrate national and special days with events aimed at social upliftment.',
    ],
  },
  {
    icon: 'fa-users',
    title: 'Community Building',
    color: 'text-teal-500',
    description: [
      'Encourage students to take active roles in social initiatives, building a strong network of changemakers.',
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
        <li key={index}>{point}</li>
      ))}
    </ul>
  </div>
);

const OurServices = () => {
  return (
    <section className="bg-gray-50 py-16 sm:py-20 font-poppins">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-dark-blue uppercase">
            What We Do
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Our initiatives are focused on creating a positive impact in the community through various service-oriented activities.
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



import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUsers, 
  FaRocket, 
  FaGlobe, 
  FaSatellite, 
  FaEnvelope,
  FaLinkedin,
  FaTwitter,
  FaGithub,
  FaAward,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaSearch,
  FaFilter
} from 'react-icons/fa';

const Team = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [selectedMember, setSelectedMember] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sample team data
  const sampleTeam = [
    {
      id: 1,
      name: "Dr. Sarah Chen",
      title: "Chief Scientist",
      department: "Research & Development",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      bio: "Dr. Chen leads NASA's exoplanet research program and has discovered over 50 exoplanets. She holds a Ph.D. in Astrophysics from MIT and has published over 200 peer-reviewed papers.",
      email: "sarah.chen@nasa.gov",
      linkedin: "https://linkedin.com/in/sarahchen",
      twitter: "https://twitter.com/sarahchen_astro",
      github: "https://github.com/sarahchen",
      location: "Jet Propulsion Laboratory, Pasadena, CA",
      joinDate: "2015",
      education: "Ph.D. Astrophysics, MIT",
      expertise: ["Exoplanet Research", "Astrophysics", "Data Analysis", "Machine Learning"],
      achievements: [
        "NASA Exceptional Scientific Achievement Medal (2022)",
        "Breakthrough Prize in Fundamental Physics (2021)",
        "American Astronomical Society Early Career Award (2019)"
      ],
      currentProjects: [
        "James Webb Space Telescope Exoplanet Observations",
        "Next-Generation Exoplanet Detection Algorithms",
        "Habitable Zone Characterization Study"
      ]
    },
    {
      id: 2,
      name: "Commander Michael Rodriguez",
      title: "Mission Director",
      department: "Mission Operations",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      bio: "Commander Rodriguez is a veteran astronaut with over 500 days in space across three missions. He now leads mission operations for NASA's Artemis program and oversees crew training.",
      email: "michael.rodriguez@nasa.gov",
      linkedin: "https://linkedin.com/in/michaelrodriguez",
      twitter: "https://twitter.com/cmdr_rodriguez",
      github: null,
      location: "Johnson Space Center, Houston, TX",
      joinDate: "2008",
      education: "M.S. Aerospace Engineering, Stanford University",
      expertise: ["Space Operations", "Crew Training", "Mission Planning", "International Cooperation"],
      achievements: [
        "NASA Distinguished Service Medal (2023)",
        "International Space Station Commander (2020)",
        "Space Shuttle Mission Specialist (2012, 2015)"
      ],
      currentProjects: [
        "Artemis II Mission Planning",
        "International Space Station Operations",
        "Next-Generation Spacecraft Development"
      ]
    },
    {
      id: 3,
      name: "Dr. Aisha Patel",
      title: "Satellite Systems Engineer",
      department: "Engineering",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      bio: "Dr. Patel specializes in satellite communication systems and has designed critical components for over 20 NASA missions. She is a leading expert in space-based communication protocols.",
      email: "aisha.patel@nasa.gov",
      linkedin: "https://linkedin.com/in/aishapatel",
      twitter: "https://twitter.com/aisha_space_eng",
      github: "https://github.com/aishapatel",
      location: "Goddard Space Flight Center, Greenbelt, MD",
      joinDate: "2017",
      education: "Ph.D. Electrical Engineering, Caltech",
      expertise: ["Satellite Communications", "Signal Processing", "Antenna Design", "System Integration"],
      achievements: [
        "NASA Early Career Achievement Medal (2022)",
        "IEEE Aerospace Conference Best Paper Award (2021)",
        "Women in Aerospace Achievement Award (2020)"
      ],
      currentProjects: [
        "Next-Generation Satellite Communication Network",
        "Deep Space Network Enhancement",
        "Quantum Communication for Space Applications"
      ]
    },
    {
      id: 4,
      name: "Dr. James Thompson",
      title: "Data Science Lead",
      department: "Data Analytics",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      bio: "Dr. Thompson leads NASA's data science initiatives, developing machine learning algorithms to analyze vast amounts of space data. He has created tools used by thousands of researchers worldwide.",
      email: "james.thompson@nasa.gov",
      linkedin: "https://linkedin.com/in/jamesthompson",
      twitter: "https://twitter.com/james_data_sci",
      github: "https://github.com/jamesthompson",
      location: "Ames Research Center, Mountain View, CA",
      joinDate: "2019",
      education: "Ph.D. Computer Science, Carnegie Mellon University",
      expertise: ["Machine Learning", "Big Data Analytics", "Cloud Computing", "Scientific Computing"],
      achievements: [
        "NASA Software of the Year Award (2023)",
        "ACM SIGKDD Innovation Award (2022)",
        "Federal 100 Award for Technology Leadership (2021)"
      ],
      currentProjects: [
        "AI-Powered Space Data Analysis Platform",
        "Automated Exoplanet Detection System",
        "Real-Time Mission Data Processing"
      ]
    },
    {
      id: 5,
      name: "Dr. Maria Gonzalez",
      title: "Planetary Geologist",
      department: "Planetary Science",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      bio: "Dr. Gonzalez is a leading planetary geologist specializing in Mars exploration. She has analyzed data from multiple Mars rovers and is a key scientist on the Perseverance mission.",
      email: "maria.gonzalez@nasa.gov",
      linkedin: "https://linkedin.com/in/mariagonzalez",
      twitter: "https://twitter.com/maria_mars_geo",
      github: "https://github.com/mariagonzalez",
      location: "Jet Propulsion Laboratory, Pasadena, CA",
      joinDate: "2016",
      education: "Ph.D. Planetary Geology, University of Arizona",
      expertise: ["Planetary Geology", "Mars Exploration", "Remote Sensing", "Geochemical Analysis"],
      achievements: [
        "NASA Group Achievement Award - Perseverance Team (2022)",
        "Geological Society of America Young Scientist Award (2020)",
        "Mars Exploration Program Outstanding Scientist (2019)"
      ],
      currentProjects: [
        "Mars Sample Return Mission Planning",
        "Jezero Crater Geological Analysis",
        "Next-Generation Mars Rover Instrumentation"
      ]
    },
    {
      id: 6,
      name: "Dr. David Kim",
      title: "Mission Systems Engineer",
      department: "Engineering",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      bio: "Dr. Kim is a systems engineer specializing in mission design and spacecraft integration. He has worked on numerous NASA missions and is currently leading the Europa Clipper mission design.",
      email: "david.kim@nasa.gov",
      linkedin: "https://linkedin.com/in/davidkim",
      twitter: "https://twitter.com/david_space_eng",
      github: "https://github.com/davidkim",
      location: "Jet Propulsion Laboratory, Pasadena, CA",
      joinDate: "2014",
      education: "Ph.D. Aerospace Engineering, Georgia Tech",
      expertise: ["Mission Design", "Systems Engineering", "Spacecraft Integration", "Risk Management"],
      achievements: [
        "NASA Exceptional Engineering Achievement Medal (2023)",
        "AIAA Space Systems Award (2022)",
        "Europa Clipper Mission Team Recognition (2021)"
      ],
      currentProjects: [
        "Europa Clipper Mission Development",
        "Artemis Program Systems Integration",
        "Next-Generation Spacecraft Architecture"
      ]
    }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setTeamMembers(sampleTeam);
      setFilteredMembers(sampleTeam);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let filtered = teamMembers;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.expertise.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Department filter
    if (filterDepartment !== 'all') {
      filtered = filtered.filter(member => member.department === filterDepartment);
    }

    setFilteredMembers(filtered);
  }, [teamMembers, searchTerm, filterDepartment]);

  const getUniqueDepartments = () => {
    const departments = teamMembers.map(member => member.department);
    return [...new Set(departments)];
  };

  const getDepartmentIcon = (department) => {
    switch (department) {
      case 'Research & Development':
        return FaRocket;
      case 'Mission Operations':
        return FaGlobe;
      case 'Engineering':
        return FaSatellite;
      case 'Data Analytics':
        return FaAward;
      case 'Planetary Science':
        return FaGlobe;
      default:
        return FaUsers;
    }
  };

  const getDepartmentColor = (department) => {
    switch (department) {
      case 'Research & Development':
        return 'neon-blue';
      case 'Mission Operations':
        return 'neon-green';
      case 'Engineering':
        return 'neon-purple';
      case 'Data Analytics':
        return 'neon-pink';
      case 'Planetary Science':
        return 'neon-blue';
      default:
        return 'gray-400';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neon-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neon-blue text-lg">Loading team...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-space font-bold text-gradient mb-4">
            Our Team
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Meet the brilliant minds behind NASA's space exploration missions. 
            Our diverse team of scientists, engineers, and mission specialists work together to push the boundaries of human knowledge.
          </p>
        </motion.div>

        {/* Team Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
        >
          <div className="bg-space-gray/30 backdrop-blur-sm border border-neon-blue/20 rounded-xl p-6 text-center">
            <FaUsers className="text-3xl text-neon-blue mx-auto mb-3" />
            <h3 className="text-2xl font-space font-bold text-gradient mb-1">
              {teamMembers.length}
            </h3>
            <p className="text-gray-300">Team Members</p>
          </div>
          
          <div className="bg-space-gray/30 backdrop-blur-sm border border-neon-green/20 rounded-xl p-6 text-center">
            <FaGraduationCap className="text-3xl text-neon-green mx-auto mb-3" />
            <h3 className="text-2xl font-space font-bold text-gradient mb-1">
              {getUniqueDepartments().length}
            </h3>
            <p className="text-gray-300">Departments</p>
          </div>
          
          <div className="bg-space-gray/30 backdrop-blur-sm border border-neon-purple/20 rounded-xl p-6 text-center">
            <FaAward className="text-3xl text-neon-purple mx-auto mb-3" />
            <h3 className="text-2xl font-space font-bold text-gradient mb-1">
              {teamMembers.reduce((acc, member) => acc + member.achievements.length, 0)}
            </h3>
            <p className="text-gray-300">Awards</p>
          </div>
          
          <div className="bg-space-gray/30 backdrop-blur-sm border border-neon-pink/20 rounded-xl p-6 text-center">
            <FaRocket className="text-3xl text-neon-pink mx-auto mb-3" />
            <h3 className="text-2xl font-space font-bold text-gradient mb-1">
              {teamMembers.reduce((acc, member) => acc + member.currentProjects.length, 0)}
            </h3>
            <p className="text-gray-300">Active Projects</p>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-space-gray/30 backdrop-blur-sm border border-neon-blue/20 rounded-xl p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neon-blue" />
              <input
                type="text"
                placeholder="Search team members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 form-input focus:border-neon-blue focus:shadow-neon"
              />
            </div>

            {/* Department Filter */}
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="form-input"
            >
              <option value="all">All Departments</option>
              {getUniqueDepartments().map(department => (
                <option key={department} value={department}>{department}</option>
              ))}
            </select>

            {/* Results Count */}
            <div className="flex items-center justify-center">
              <span className="text-neon-blue font-medium">
                {filteredMembers.length} team members found
              </span>
            </div>
          </div>
        </motion.div>

        {/* Team Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredMembers.map((member, index) => {
            const DepartmentIcon = getDepartmentIcon(member.department);
            const departmentColor = getDepartmentColor(member.department);
            
            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-space-gray/30 backdrop-blur-sm border border-neon-blue/20 rounded-xl overflow-hidden hover:border-neon-blue/40 transition-all duration-500 card-hover group"
              >
                {/* Member Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  
                  {/* Department Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-${departmentColor}/20 text-${departmentColor} border border-${departmentColor}/30 flex items-center space-x-1`}>
                      <DepartmentIcon className="text-xs" />
                      <span>{member.department}</span>
                    </span>
                  </div>

                  {/* Social Links */}
                  <div className="absolute top-4 right-4 flex space-x-2">
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 bg-neon-blue/20 hover:bg-neon-blue/30 border border-neon-blue/30 rounded-full flex items-center justify-center text-neon-blue hover:text-white transition-all duration-300"
                      >
                        <FaLinkedin className="text-sm" />
                      </a>
                    )}
                    {member.twitter && (
                      <a
                        href={member.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 bg-neon-purple/20 hover:bg-neon-purple/30 border border-neon-purple/30 rounded-full flex items-center justify-center text-neon-purple hover:text-white transition-all duration-300"
                      >
                        <FaTwitter className="text-sm" />
                      </a>
                    )}
                    {member.github && (
                      <a
                        href={member.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 bg-neon-green/20 hover:bg-neon-green/30 border border-neon-green/30 rounded-full flex items-center justify-center text-neon-green hover:text-white transition-all duration-300"
                      >
                        <FaGithub className="text-sm" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-space font-bold text-gradient mb-1 group-hover:text-neon-blue transition-colors duration-300">
                    {member.name}
                  </h3>
                  <p className="text-neon-blue font-medium mb-3">{member.title}</p>
                  
                  <p className="text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed">
                    {member.bio}
                  </p>

                  {/* Key Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm">
                      <FaMapMarkerAlt className="text-neon-green" />
                      <span className="text-gray-300">{member.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <FaCalendarAlt className="text-neon-purple" />
                      <span className="text-gray-300">Joined {member.joinDate}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <FaGraduationCap className="text-neon-pink" />
                      <span className="text-gray-300">{member.education}</span>
                    </div>
                  </div>

                  {/* Expertise Tags */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {member.expertise.slice(0, 3).map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="px-2 py-1 bg-neon-blue/10 text-neon-blue text-xs rounded-full border border-neon-blue/20"
                        >
                          {skill}
                        </span>
                      ))}
                      {member.expertise.length > 3 && (
                        <span className="px-2 py-1 bg-gray-400/10 text-gray-400 text-xs rounded-full border border-gray-400/20">
                          +{member.expertise.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setSelectedMember(member)}
                      className="flex-1 btn-neon text-sm py-2 px-4"
                    >
                      View Profile
                    </button>
                    <a
                      href={`mailto:${member.email}`}
                      className="px-4 py-2 bg-neon-purple/20 hover:bg-neon-purple/30 border border-neon-purple/30 rounded-lg text-neon-purple hover:text-white transition-all duration-300"
                    >
                      <FaEnvelope />
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Empty State */}
        {filteredMembers.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <FaUsers className="text-6xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-space font-bold text-gray-400 mb-2">
              No team members found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search criteria or filters
            </p>
          </motion.div>
        )}
      </div>

      {/* Team Member Detail Modal */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedMember(null)}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative bg-space-dark border border-neon-blue/30 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-space font-bold text-gradient">
                    {selectedMember.name}
                  </h2>
                  <button
                    onClick={() => setSelectedMember(null)}
                    className="text-gray-400 hover:text-white text-3xl"
                  >
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column - Image and Basic Info */}
                  <div className="lg:col-span-1">
                    <img
                      src={selectedMember.image}
                      alt={selectedMember.name}
                      className="w-full h-64 object-cover rounded-lg mb-6"
                    />
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold text-neon-blue mb-2">Contact</h3>
                        <div className="space-y-2">
                          <a
                            href={`mailto:${selectedMember.email}`}
                            className="flex items-center space-x-2 text-gray-300 hover:text-neon-blue transition-colors duration-300"
                          >
                            <FaEnvelope className="text-sm" />
                            <span>{selectedMember.email}</span>
                          </a>
                          <div className="flex items-center space-x-2 text-gray-300">
                            <FaMapMarkerAlt className="text-sm" />
                            <span>{selectedMember.location}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-neon-blue mb-2">Education</h3>
                        <p className="text-gray-300">{selectedMember.education}</p>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-neon-blue mb-2">Joined NASA</h3>
                        <p className="text-gray-300">{selectedMember.joinDate}</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Detailed Info */}
                  <div className="lg:col-span-2">
                    <div className="mb-6">
                      <h3 className="text-xl font-semibold text-neon-blue mb-2">{selectedMember.title}</h3>
                      <p className="text-gray-300 leading-relaxed">{selectedMember.bio}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold text-neon-blue mb-3">Expertise</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedMember.expertise.map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-neon-blue/10 text-neon-blue text-sm rounded-full border border-neon-blue/20"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-neon-blue mb-3">Current Projects</h3>
                        <ul className="space-y-2">
                          {selectedMember.currentProjects.map((project, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <div className="w-2 h-2 bg-neon-green rounded-full mt-2 flex-shrink-0" />
                              <span className="text-gray-300 text-sm">{project}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-neon-blue mb-3">Achievements</h3>
                      <ul className="space-y-2">
                        {selectedMember.achievements.map((achievement, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <FaAward className="text-neon-purple mt-1 flex-shrink-0" />
                            <span className="text-gray-300 text-sm">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Team;


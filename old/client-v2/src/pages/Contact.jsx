import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaClock,
  FaPaperPlane,
  FaCheckCircle,
  FaExclamationCircle,
  FaUser,
  FaBuilding,
  FaComment,
  FaRocket,
  FaGlobe,
  FaSatellite,
  FaUsers
} from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', null

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        organization: '',
        subject: '',
        message: '',
        inquiryType: 'general'
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: FaMapMarkerAlt,
      title: "Address",
      details: [
        "NASA Headquarters",
        "300 E Street SW",
        "Washington, DC 20546"
      ],
      color: "neon-blue"
    },
    {
      icon: FaPhone,
      title: "Phone",
      details: [
        "+1 (202) 358-0001",
        "+1 (202) 358-0002 (Fax)"
      ],
      color: "neon-green"
    },
    {
      icon: FaEnvelope,
      title: "Email",
      details: [
        "public-inquiries@nasa.gov",
        "media@nasa.gov"
      ],
      color: "neon-purple"
    },
    {
      icon: FaClock,
      title: "Hours",
      details: [
        "Monday - Friday: 8:00 AM - 5:00 PM EST",
        "Saturday - Sunday: Closed"
      ],
      color: "neon-pink"
    }
  ];

  const inquiryTypes = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'media', label: 'Media Request' },
    { value: 'education', label: 'Educational Program' },
    { value: 'research', label: 'Research Collaboration' },
    { value: 'career', label: 'Career Opportunities' },
    { value: 'technical', label: 'Technical Support' }
  ];

  const quickLinks = [
    {
      icon: FaRocket,
      title: "Mission Updates",
      description: "Get the latest news on NASA missions",
      link: "/missions",
      color: "neon-blue"
    },
    {
      icon: FaGlobe,
      title: "Exoplanet Data",
      description: "Access exoplanet research data",
      link: "/exoplanets",
      color: "neon-purple"
    },
    {
      icon: FaSatellite,
      title: "Satellite Tracking",
      description: "Track satellites in real-time",
      link: "/satellites",
      color: "neon-green"
    },
    {
      icon: FaUsers,
      title: "Meet Our Team",
      description: "Learn about our scientists and engineers",
      link: "/team",
      color: "neon-pink"
    }
  ];

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
            Contact NASA
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Get in touch with NASA for inquiries, media requests, educational programs, 
            and research collaborations. We're here to help you explore the universe.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-1 space-y-6"
          >
            <div className="bg-space-gray/30 backdrop-blur-sm border border-neon-blue/20 rounded-xl p-6">
              <h2 className="text-2xl font-space font-bold text-gradient mb-6">
                Get in Touch
              </h2>
              <div className="space-y-6">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                      className="flex items-start space-x-4"
                    >
                      <div className={`w-12 h-12 bg-${info.color}/20 rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`text-${info.color} text-xl`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-star-white mb-2">{info.title}</h3>
                        {info.details.map((detail, detailIndex) => (
                          <p key={detailIndex} className="text-gray-300 text-sm mb-1">
                            {detail}
                          </p>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-space-gray/30 backdrop-blur-sm border border-neon-blue/20 rounded-xl p-6">
              <h3 className="text-xl font-space font-bold text-gradient mb-4">
                Quick Links
              </h3>
              <div className="space-y-3">
                {quickLinks.map((link, index) => {
                  const Icon = link.icon;
                  return (
                    <motion.a
                      key={index}
                      href={link.link}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                      className="flex items-center space-x-3 p-3 rounded-lg bg-space-gray/20 hover:bg-neon-blue/10 border border-neon-blue/10 hover:border-neon-blue/30 transition-all duration-300 group"
                    >
                      <Icon className={`text-${link.color} group-hover:scale-110 transition-transform duration-300`} />
                      <div>
                        <h4 className="font-medium text-star-white group-hover:text-neon-blue transition-colors duration-300">
                          {link.title}
                        </h4>
                        <p className="text-xs text-gray-400">{link.description}</p>
                      </div>
                    </motion.a>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-space-gray/30 backdrop-blur-sm border border-neon-blue/20 rounded-xl p-8">
              <h2 className="text-2xl font-space font-bold text-gradient mb-6">
                Send us a Message
              </h2>

              {/* Success/Error Messages */}
              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-neon-green/10 border border-neon-green/30 rounded-lg flex items-center space-x-3"
                >
                  <FaCheckCircle className="text-neon-green text-xl" />
                  <div>
                    <h3 className="font-semibold text-neon-green">Message Sent Successfully!</h3>
                    <p className="text-gray-300 text-sm">We'll get back to you within 24 hours.</p>
                  </div>
                </motion.div>
              )}

              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-400/10 border border-red-400/30 rounded-lg flex items-center space-x-3"
                >
                  <FaExclamationCircle className="text-red-400 text-xl" />
                  <div>
                    <h3 className="font-semibold text-red-400">Error Sending Message</h3>
                    <p className="text-gray-300 text-sm">Please try again or contact us directly.</p>
                  </div>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name and Email Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-neon-blue mb-2">
                      <FaUser className="inline mr-2" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full form-input"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-neon-blue mb-2">
                      <FaEnvelope className="inline mr-2" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full form-input"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                {/* Organization and Inquiry Type Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="organization" className="block text-sm font-medium text-neon-blue mb-2">
                      <FaBuilding className="inline mr-2" />
                      Organization
                    </label>
                    <input
                      type="text"
                      id="organization"
                      name="organization"
                      value={formData.organization}
                      onChange={handleInputChange}
                      className="w-full form-input"
                      placeholder="Your organization (optional)"
                    />
                  </div>
                  <div>
                    <label htmlFor="inquiryType" className="block text-sm font-medium text-neon-blue mb-2">
                      Inquiry Type *
                    </label>
                    <select
                      id="inquiryType"
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleInputChange}
                      required
                      className="w-full form-input"
                    >
                      {inquiryTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-neon-blue mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full form-input"
                    placeholder="Brief description of your inquiry"
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-neon-blue mb-2">
                    <FaComment className="inline mr-2" />
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full form-input resize-none"
                    placeholder="Please provide details about your inquiry..."
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full btn-neon text-lg py-4 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <FaPaperPlane />
                      <span>Send Message</span>
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>

        {/* Additional Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12"
        >
          <div className="bg-space-gray/30 backdrop-blur-sm border border-neon-blue/20 rounded-xl p-8">
            <h2 className="text-2xl font-space font-bold text-gradient mb-6 text-center">
              Additional Resources
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-neon-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaRocket className="text-neon-blue text-2xl" />
                </div>
                <h3 className="text-lg font-semibold text-star-white mb-2">Mission Updates</h3>
                <p className="text-gray-300 text-sm">
                  Stay updated with the latest NASA mission news and discoveries.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-neon-purple/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaGlobe className="text-neon-purple text-2xl" />
                </div>
                <h3 className="text-lg font-semibold text-star-white mb-2">Educational Resources</h3>
                <p className="text-gray-300 text-sm">
                  Access educational materials and programs for students and teachers.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-neon-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaUsers className="text-neon-green text-2xl" />
                </div>
                <h3 className="text-lg font-semibold text-star-white mb-2">Community</h3>
                <p className="text-gray-300 text-sm">
                  Join our community of space enthusiasts and researchers.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;


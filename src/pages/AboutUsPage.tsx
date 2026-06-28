
export default function AboutUsPage() {
  const teamMembers = [
    { name: 'Jane Doe', role: 'CEO & Founder', image: 'https://placeholder.com' },
    { name: 'John Smith', role: 'Lead Developer', image: 'https://placeholder.com' },
    { name: 'Alex Johnson', role: 'Creative Director', image: 'https://placeholder.com' }
  ];

  return (
    <section className="about-section">
      <div className="container">
        {/* Company Overview */}
        <div className="about-header">
          <h1>About Our Company</h1>
          <p className="subtitle">Building innovative solutions for a better tomorrow.</p>
        </div>

        <div className="about-content">
          <div className="about-text">
            <h2>Our Mission</h2>
            <p>
              We strive to deliver high-quality, scalable web applications that empower 
              businesses globally. Our team leverages modern technology like React to 
              create seamless, highly responsive user experiences.
            </p>
          </div>
        </div>

        {/* Team Grid */}
        <div className="team-section">
          <h2>Meet the Team</h2>
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div key={index} className="team-card">
                <img src={member.image} alt={member.name} className="team-img" />
                <h3>{member.name}</h3>
                <p className="role">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

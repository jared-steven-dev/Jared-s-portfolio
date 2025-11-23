export default function ExperienceSection() {
  const experiences = [
    {
      period: "Aug 2024 - Present",
      title: "AI Engineer",
      company: "Icanio Technologies",
      description: "Developed and deployed NLP and CV models for enterprise clients. Also, implemented chatbots for various use cases like customer support, sales, and marketing.",
      isCurrent: true
    },
    {
      period: "Feb 2022 - July 2024",
      title: "Full Stack Developer Specializing in AI",
      company: "Freelance",
      description: "Developed full-stack applications for clients using React, Node.js, and Python. Also, built real-time AI models for clients using Python TensorFlow and PyTorch.",
      isCurrent: false
    },
    {
      period: "Oct 2021 - Feb 2022",
      title: "Data Mining Researcher",
      company: "Profive Infotech",
      description: "Researched and developed data mining models for customer churn prediction, Agriculture, and E-commerce. Also, built real-time serving infrastructure on cloud services like AWS, GCP, and Azure for data mining tasks.",
      isCurrent: false
    },
    {
      period: "July 2021 - Sept 2021",
      title: "Data Scientist - Intern",
      company: "EinNel Technologies",
      description: "Began my career focusing on data analysis, feature engineering, and building predictive models for the marketing, automotive, and product teams.",
      isCurrent: false
    }
  ];

  return (
    <section id="experience" className="py-16 md:py-24 border-t border-border">
      <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-12">
        Career Journey
      </h2>

      <div className="relative pl-6 border-l-2 border-border">
        {experiences.map((exp, index) => (
          <div key={index} className="mb-12 relative">
            <span
              className={`absolute -left-[33px] top-1 w-4 h-4 rounded-full ${
                exp.isCurrent
                  ? "bg-accent-primary"
                  : "bg-background-secondary border-2 border-border"
              }`}
            />
            <p
              className={`text-sm font-semibold uppercase tracking-wider ${
                exp.isCurrent
                  ? "text-accent-primary"
                  : "text-text-secondary"
              }`}
            >
              {exp.period}
            </p>
            <h3 className="mt-1 text-2xl font-semibold text-text-primary">
              {exp.title}
            </h3>
            <p className="text-lg text-text-secondary">
              {exp.company}
            </p>
            <p className="mt-3 text-base text-text-secondary max-w-xl">
              {exp.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}


export default function AboutSection() {
  const skills = [
    "Python",
    "PyTorch",
    "TensorFlow / Keras",
    "Hugging Face",
    "NLP / Transformers",
    "Computer Vision / OpenCV",
    "MLOps",
    "Docker",
    "Kubernetes",
    "AWS / GCP",
    "SQL / NoSQL"
  ];

  return (
    <section id="about" className="py-16 md:py-24 border-t border-border">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
        <div className="md:col-span-1">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
            Expertise
          </h2>
        </div>
        <div className="md:col-span-2">
          <p className="text-lg text-text-secondary leading-relaxed">
            My work sits at the intersection of AI strategy, product development, and production engineering. I specialize in guiding AI initiatives from vague ideas to measurable business impact—ensuring each investment in AI is technically sound, economically justified, and operationally sustainable.
          </p>
          <p className="mt-6 text-lg text-text-secondary leading-relaxed">
            "AI success is not defined by model accuracy—it is defined by adoption, reliability, ROI, and longevity in production."
          </p>

          <div className="mt-12">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-text-secondary">
              Core Toolkit
            </h3>
            <div className="flex flex-wrap gap-3 mt-4">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-block bg-background-secondary border border-border px-3 py-1 rounded-full text-sm text-text-secondary font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


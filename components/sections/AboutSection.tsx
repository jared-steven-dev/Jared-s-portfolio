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
            My focus is on the complete machine learning lifecycle, from data inception to scalable production deployment. I thrive on architecting systems that are not only intelligent but also robust, efficient, and maintainable.
          </p>
          <p className="mt-6 text-lg text-text-secondary leading-relaxed">
            Whether it&apos;s fine-tuning a 70B parameter LLM, building a real-time computer vision pipeline, or setting up a Kubernetes cluster for model serving, I bring a pragmatic and detail-oriented approach to every challenge.
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


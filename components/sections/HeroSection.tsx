export default function HeroSection() {
  return (
    <section id="home" className="py-24 md:py-36">
      <h1 className="text-5xl md:text-7xl font-bold text-text-primary leading-tight">
        Jared Steven
      </h1>
      <p className="mt-4 text-2xl md:text-3xl text-text-secondary max-w-3xl">
        AI Engineer specializing in Natural Language Processing and large-scale model deployment.
      </p>
      <p className="mt-8 text-lg text-text-secondary max-w-2xl">
        I design, build, and scale intelligent systems that solve complex real-world problems. With over 3+ years of experience, I bridge the gap between cutting-edge research and production-ready MLOps.
      </p>
      <a
        href="#contact"
        className="inline-block mt-10 bg-accent-primary text-accent-text px-8 py-3 text-lg font-medium rounded-lg hover:bg-opacity-90 transition-colors duration-200"
      >
        Get in Touch
      </a>
    </section>
  );
}


export default function HeroSection() {
  return (
    <section id="home" className="py-24 md:py-36">
      <h1 className="text-5xl md:text-7xl font-bold text-text-primary leading-tight">
        Hi, I'm Jared Steven
      </h1>
      <p className="mt-4 text-2xl md:text-3xl text-text-secondary max-w-3xl">
        I lead end-to-end AI strategy—from use-case selection and architecture to deployment, governance, and lifecycle management—ensuring AI systems perform in the real world, not just in experiments.
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


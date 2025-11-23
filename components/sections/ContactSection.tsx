export default function ContactSection() {
  return (
    <section id="contact" className="bg-background-secondary py-24 md:py-32">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-text-primary">
          Let&apos;s Collaborate
        </h2>
        <p className="mt-6 text-xl text-text-secondary leading-relaxed">
          I&apos;m always interested in new challenges and opportunities. Whether you have a project in mind or just want to discuss the future of AI, feel free to reach out.
        </p>

        <a
          href="mailto:jared21profess@gmail.com"
          className="inline-block mt-10 bg-accent-primary text-accent-text px-8 py-3 text-lg font-medium rounded-lg hover:bg-opacity-90 transition-colors duration-200"
        >
          jared21profess@gmail.com
        </a>

        <div className="flex justify-center items-center space-x-8 mt-12">
          <a
            href="https://www.linkedin.com/in/jared-steven-4b551b391/"
            className="text-text-secondary hover:text-accent-primary transition-colors duration-200"
            title="LinkedIn"
          >
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                clipRule="evenodd"
              />
            </svg>
            <span className="sr-only">LinkedIn</span>
          </a>
          <a
            href="https://github.com/jared-steven-dev"
            className="text-text-secondary hover:text-accent-primary transition-colors duration-200"
            title="GitHub"
          >
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.165 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.03-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.026 2.747-1.026.546 1.379.202 2.398.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .267.18.577.688.48C19.135 20.165 22 16.418 22 12 22 6.477 17.523 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
            <span className="sr-only">GitHub</span>
          </a>
        </div>
      </div>
    </section>
  );
}


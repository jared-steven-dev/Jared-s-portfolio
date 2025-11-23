"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  skills: string[];
  link: string;
  link_text: string;
}

export default function WorkSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    const { data, error } = await supabase
      .from('work_projects')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error loading projects:', error);
    } else {
      setProjects(data || []);
    }
    setLoading(false);
  };

  return (
    <section id="work" className="py-16 md:py-24 border-t border-border">
      <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
        Selected Work
      </h2>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-text-secondary">Loading projects...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-text-secondary">No projects yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-background-secondary rounded-lg border border-border overflow-hidden group"
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-text-primary">
                  {project.title}
                </h3>
                <p className="mt-3 text-text-secondary">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-3 mt-5">
                  {project.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-block bg-background-secondary border border-border px-3 py-1 rounded-full text-sm text-text-secondary font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <a href={project.link} className="inline-flex items-center mt-6 font-medium text-accent-primary group">
                  {project.link_text}
                  <svg
                    className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}


"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface WorkProject {
    id?: number;
    title: string;
    description: string;
    image: string;
    skills: string[];
    link: string;
    linkText: string;
    order_index: number;
}

export default function WorkEditorPage() {
    const [projects, setProjects] = useState<WorkProject[]>([]);
    const [currentProject, setCurrentProject] = useState<WorkProject>({
        title: '',
        description: '',
        image: '',
        skills: [],
        link: '',
        linkText: 'View Project',
        order_index: 0,
    });
    const [skillInput, setSkillInput] = useState('');
    const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
    const [showProjectList, setShowProjectList] = useState(false);

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
    };

    const addSkill = () => {
        if (skillInput.trim() && !currentProject.skills.includes(skillInput.trim())) {
            setCurrentProject({
                ...currentProject,
                skills: [...currentProject.skills, skillInput.trim()]
            });
            setSkillInput('');
        }
    };

    const removeSkill = (skillToRemove: string) => {
        setCurrentProject({
            ...currentProject,
            skills: currentProject.skills.filter(skill => skill !== skillToRemove)
        });
    };

    const saveProject = async () => {
        if (!currentProject.title || !currentProject.description) {
            alert('Please fill in title and description');
            return;
        }

        const projectData = {
            title: currentProject.title,
            description: currentProject.description,
            image: currentProject.image,
            skills: currentProject.skills,
            link: currentProject.link,
            link_text: currentProject.linkText,
            order_index: currentProject.order_index || projects.length,
        };

        if (editingProjectId) {
            const { error } = await supabase
                .from('work_projects')
                .update(projectData)
                .eq('id', editingProjectId);

            if (error) {
                console.error('Error updating project:', error);
                alert('Error updating project: ' + error.message);
            } else {
                alert('Project updated successfully!');
                loadProjects();
            }
        } else {
            const { error } = await supabase
                .from('work_projects')
                .insert([projectData]);

            if (error) {
                console.error('Error saving project:', error);
                alert('Error saving project: ' + error.message);
            } else {
                alert('Project saved successfully!');
                loadProjects();
                resetEditor();
            }
        }
    };

    const loadProject = (project: any) => {
        setCurrentProject({
            title: project.title,
            description: project.description,
            image: project.image,
            skills: project.skills || [],
            link: project.link,
            linkText: project.link_text,
            order_index: project.order_index,
        });
        setEditingProjectId(project.id);
        setShowProjectList(false);
    };

    const resetEditor = () => {
        setCurrentProject({
            title: '',
            description: '',
            image: '',
            skills: [],
            link: '',
            linkText: 'View Project',
            order_index: projects.length,
        });
        setEditingProjectId(null);
    };

    const deleteProject = async (id: number) => {
        if (confirm('Are you sure you want to delete this project?')) {
            const { error } = await supabase
                .from('work_projects')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('Error deleting project:', error);
            } else {
                alert('Project deleted successfully!');
                loadProjects();
            }
        }
    };

    return (
        <div className="bg-background-primary text-text-primary min-h-screen">
            <Header />
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl md:text-5xl font-bold text-text-primary">
                        {editingProjectId ? 'Edit Project' : 'Add New Project'}
                    </h1>
                    <div className="space-x-4">
                        <button
                            onClick={() => setShowProjectList(!showProjectList)}
                            className="px-4 py-2 bg-background-secondary border border-border rounded-md hover:border-accent-primary transition-colors"
                        >
                            {showProjectList ? 'Hide Projects' : 'View Projects'}
                        </button>
                        {editingProjectId && (
                            <button
                                onClick={resetEditor}
                                className="px-4 py-2 bg-background-secondary border border-border rounded-md hover:border-accent-primary transition-colors"
                            >
                                New Project
                            </button>
                        )}
                    </div>
                </div>

                {showProjectList && (
                    <div className="mb-8 p-6 bg-background-secondary border border-border rounded-lg">
                        <h2 className="text-2xl font-bold mb-4">All Projects</h2>
                        {projects.length === 0 ? (
                            <p className="text-text-secondary">No projects yet</p>
                        ) : (
                            <div className="space-y-2">
                                {projects.map((project: any) => (
                                    <div key={project.id} className="flex justify-between items-center p-4 bg-background-primary border border-border rounded-md">
                                        <div>
                                            <h3 className="font-semibold">{project.title}</h3>
                                            <p className="text-sm text-text-secondary">Order: {project.order_index}</p>
                                        </div>
                                        <div className="space-x-2">
                                            <button
                                                onClick={() => loadProject(project)}
                                                className="px-3 py-1 bg-accent-primary text-white rounded-md hover:opacity-80"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => deleteProject(project.id)}
                                                className="px-3 py-1 bg-red-500 text-white rounded-md hover:opacity-80"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Project Title *</label>
                            <input
                                type="text"
                                value={currentProject.title}
                                onChange={(e) => setCurrentProject({ ...currentProject, title: e.target.value })}
                                placeholder="E.g., Sentinel NLP Engine"
                                className="w-full p-3 bg-background-secondary border border-border rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Display Order</label>
                            <input
                                type="number"
                                value={currentProject.order_index}
                                onChange={(e) => setCurrentProject({ ...currentProject, order_index: parseInt(e.target.value) })}
                                placeholder="0"
                                className="w-full p-3 bg-background-secondary border border-border rounded-md"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Description *</label>
                        <textarea
                            value={currentProject.description}
                            onChange={(e) => setCurrentProject({ ...currentProject, description: e.target.value })}
                            placeholder="Brief description of the project..."
                            rows={4}
                            className="w-full p-3 bg-background-secondary border border-border rounded-md"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Image URL</label>
                        <input
                            type="text"
                            value={currentProject.image}
                            onChange={(e) => setCurrentProject({ ...currentProject, image: e.target.value })}
                            placeholder="https://example.com/project-image.jpg"
                            className="w-full p-3 bg-background-secondary border border-border rounded-md"
                        />
                        {currentProject.image && (
                            <img src={currentProject.image} alt="Preview" className="mt-2 w-full h-48 object-cover rounded-md" />
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Skills/Technologies</label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={skillInput}
                                onChange={(e) => setSkillInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                                placeholder="E.g., React, Python, AWS"
                                className="flex-1 p-3 bg-background-secondary border border-border rounded-md"
                            />
                            <button
                                onClick={addSkill}
                                className="px-6 py-3 bg-accent-primary text-white rounded-md hover:opacity-90"
                            >
                                Add
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {currentProject.skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center gap-2 bg-background-secondary border border-border px-3 py-1 rounded-full text-sm"
                                >
                                    {skill}
                                    <button
                                        onClick={() => removeSkill(skill)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Project Link</label>
                            <input
                                type="text"
                                value={currentProject.link}
                                onChange={(e) => setCurrentProject({ ...currentProject, link: e.target.value })}
                                placeholder="https://..."
                                className="w-full p-3 bg-background-secondary border border-border rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Link Text</label>
                            <input
                                type="text"
                                value={currentProject.linkText}
                                onChange={(e) => setCurrentProject({ ...currentProject, linkText: e.target.value })}
                                placeholder="View Project"
                                className="w-full p-3 bg-background-secondary border border-border rounded-md"
                            />
                        </div>
                    </div>

                    <button
                        onClick={saveProject}
                        className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-accent-primary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-primary"
                    >
                        {editingProjectId ? 'Update Project' : 'Save Project'}
                    </button>
                </div>
            </main>
            <Footer />
        </div>
    );
}


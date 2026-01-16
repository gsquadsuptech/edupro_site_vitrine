
export const MOCK_COURSE = {
    id: "course-1",
    title: "Intelligence Artificielle Pratique pour le Business",
    slug: "intelligence-artificielle-pratique",
    thumbnail: "/ai-powered-learning-dashboard-interface.jpg", // Ensure this image exists in public
    preview_video: "", // Empty for now, or use a sample mp4 if available
    price: 45000,
    monthly_price: 15000,
    level: "Débutant to Intermédiaire",
    duration: 1200, // 20 hours in minutes
    categories: { name: "Tech & Digital" },
    instructors: { name: "Dr. Amadou Koné", avatar: "/african-male-tech-ceo-professional-portrait-smilin.jpg" },
    marketplace_courses: {
        rating: "4.8",
        review_count: 124,
    },
    sections: [
        { title: "Introduction à l'IA", lessons: 4 },
        { title: "Prompt Engineering Avancé", lessons: 6 },
        { title: "IA pour la Productivité", lessons: 5 },
        { title: "Projet Final", lessons: 1 },
    ]
};

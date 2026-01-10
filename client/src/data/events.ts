export type EventType = {
    title: string;
    description: string;
    date: string;
    time?: string;
    location?: string;
    participants: string;
    type: string;
    image: string;
    featured?: boolean;
    shortDescription?: string;
};

export const pastEvents: EventType[] = [
    {
        title: "Code Clash 2025",
        description:
            "Code Clash 2025 was an intense ICPC-style coding contest proudly hosted by Viksha Coding Club during Kalpavikas 1.0 at RV University. Participants competed in teams to solve challenging algorithmic problems within a fixed time frame, showcasing logical thinking, teamwork, and competitive programming skills. The event was powered by CodeChef, providing a professional contest platform and rewarding winners with 1-year CodeChef Pro subscriptions, making the competition both high-value and high-impact. Code Clash stood out as a celebration of coding excellence, collaboration, and technical rigor.",
        shortDescription:
            "An ICPC-style competitive coding contest testing speed, strategy, and problem-solving skills.",
        date: "2025-10-11T09:00:00",
        time: "9:00 AM – 12:00 PM",
        location: "C Block, Rooms 503 & 504, RV University",
        participants: "100+",
        type: "Competition",
        image: "/assets/codeclash.jpg",
    },
    {
        title: "Navigating Career Growth",
        description:
            "Viksha Coding Club, in collaboration with GDG On Campus RV University, organized an insightful tech talk featuring Shaurya Pratap Singh, SDE-II at Amazon. The session focused on real-world career growth strategies, industry insights, and practical guidance for aspiring developers.",
        shortDescription:
            "An expert-led tech talk by Shaurya Pratap Singh, SDE-II at Amazon, sharing real-world insights on career growth and industry best practices.",
        date: "2025-10-11T10:00:00",
        participants: "100+",
        type: "Tech Talk",
        image: "/assets/Tech Talk.jpg",
    },
    {
        title: "Argonyx ’25",
        description:
            "Argonyx ’25, presented as part of Kalpavikas 1.0, was an electrifying overnight hackathon organized by Viksha – The Coding Club of RV University, in collaboration with ECell RV University, IEEE RVU, and SoCSE. Participants ideated, built, and pitched real-world prototypes, showcasing technical innovation, teamwork, and creativity throughout the event. The hackathon fostered problem-solving, collaboration, and hands-on learning in a high-energy competitive environment.",
        shortDescription:
            "An overnight hackathon focused on innovation, building, and pitching real-world tech solutions.",
        date: "2025-10-10T10:00:00",
        participants: "200+",
        location: "RV University, Bengaluru",
        type: "Hackathon",
        image: "/assets/argonyx25.png",
    },
    {
        title: "DSA Learning Series",
        description:
            "Viksha Coding Club organized the DSA Learning Series to help students build strong foundations in Data Structures and Algorithms. The sessions focused on core concepts, problem-solving techniques, and practical coding approaches to prepare students for technical interviews and competitive programming.",
        shortDescription:
            "Hands-on sessions covering Data Structures & Algorithms with real-world coding practice.",
        date: "2025-10-01T10:00:00",
        participants: "100+",
        type: "Workshop",
        image: "/assets/DSA_SERIES.jpg",
    },
    {
        title: "RVU Santhe",
        description:
            "Viksha Coding Club set up an interactive stall at Santhe’25, RV University’s annual fest, to showcase the fun and creativity behind coding.",
        date: "2025-07-29T10:00:00",
        participants: "200+",
        type: "Competition",
        image: "/assets/p1.png",
    },
    {
        title: "Python Workshop",
        description:
            "Viksha Coding Club organized a hands-on Python workshop aimed at helping students dive into programming basics.",
        date: "2024-12-01T10:00:00",
        participants: "120",
        type: "Workshop",
        image: "/assets/p2.png",
    },
    {
        title: "Annual Hackathon 2024",
        description:
            "Argonyx’24 Hackathon was the flagship 24-hour hackathon with 244 teams from different institutions.",
        date: "2024-11-18T10:00:00",
        participants: "244 teams",
        type: "Hackathons",
        image: "/assets/p4.png",
    },
];

export const upcomingEvents: EventType[] = [];

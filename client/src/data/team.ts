export type Member = {
    name: string;
    role: string;
    img: string;
    details: string;
};

export const teamData: Record<string, Member[]> = {
    "2025": [
        {
            name: "Lohith R Gowda",
            role: "Chief Advisor",
            img: "/Core_team_img/Lohith R Gowda.jpg",
            details: "Directs the club in all aspects."
        },
        {
            name: "Keshav Singh",
            role: "President",
            img: "/Core_team_img/Keshav Singh.jpg",
            details: "Leads the club in 2025."
        },
        {
            name: "Aditya Kumar",
            role: "Vice President",
            img: "/Core_team_img/Aditya Kumar.png",
            details: "Coordinates operations."
        },
        {
            name: "Aditi Gopinath",
            role: "Technical Head",
            img: "/Core_team_img/Aditi Gopinath.jpg",
            details: "Leads the Technical initiatives"
        },
        {
            name: "Ashutosh Shekar",
            role: "Design Head",
            img: "/Core_team_img/Ashutosh Shekar.jpg",
            details: "Handles UI/UX design."
        },
        {
            name: "Deepak K.S",
            role: "Event Management Head",
            img: "Core_team_img/Deepak K.S.jpg",
            details: "Handles offline event planning & execution"
        },
    ],
     "2024": [
        { name: "Name 1", role: "Chief Advisor", img: "", details: "Directs club strategy and vision." },
        { name: "Name 2", role: "President", img: "", details: "Leads the executive team." },
        { name: "Name 3", role: "Vice President", img: "", details: "Coordinates internal club operations." },
        { name: "Name 4", role: "Technical Head", img: "", details: "Oversees technical club initiatives." },
        { name: "Name 5", role: "Design Head", img: "", details: "Manages club visual identity." },
        { name: "Name 6", role: "Event Management Head", img: "", details: "Plans and executes events." },
    ],
};

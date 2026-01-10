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
            img: "https://media.wired.com/photos/59270140f3e2356fd800b27f/191:100/w_1280,c_limit/CAHP.jpg?mbid=social_retweet",
            details: "Directs the club in all aspects."
        },
        {
            name: "Keshav Singh",
            role: "President",
            img: "https://i.redd.it/a165wzt085zb1.jpg",
            details: "Leads the club in 2025."
        },
        {
            name: "Aditya Kumar",
            role: "Vice President",
            img: "https://m.media-amazon.com/images/I/71JpPdKSEAL._UY1100_.jpg",
            details: "Coordinates operations."
        },
        {
            name: "Aditi Gopinath",
            role: "Technical Head",
            img: "https://cdn.mos.cms.futurecdn.net/Hu8Ht2LFZTdwdMvKnp9ZnA.jpg",
            details: "Leads the Technical initiatives"
        },
        {
            name: "Ashutosh Shekar",
            role: "Design Head",
            img: "https://comicbook.com/wp-content/uploads/sites/4/2025/05/hulk-mcu.jpg?w=1024",
            details: "Handles UI/UX design."
        },
        {
            name: "Deepak K.S",
            role: "Event Management Head",
            img: "https://sm.mashable.com/mashable_sea/feature/t/the-thanos/the-thanos-snap-for-real-lets-remove-humans-from-half-of-ear_bq2q.jpg",
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

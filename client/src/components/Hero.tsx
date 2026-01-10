import { Button } from "@/components/ui/button";

export default function Hero() {
  const handleJoinUsClick = () => {
    window.open("https://linktr.ee/viksha.rvu?utm_source=linktree_profile_share&ltsid=ae6875c8-8b12-40eb-b704-d43efd0e19e9", "_blank");
  };

  return (
    <section
      id="home"
      className="px-20 lg:px-8 pt-32 pb-0 relative overflow-hidden flex items-center justify-center text-center"
    >
      <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center">
        <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-8 font-['Orbitron'] text-foreground">
          VIKSHA CODING CLUB
        </h1>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleJoinUsClick}
            className="bg-[rgba(0,40,60,0.7)] border border-[rgba(70,197,212,0.5)] 
                     text-[rgba(70,197,212,0.9)] 
                     hover:bg-[rgba(0,60,90,0.9)] 
                     px-8 py-4 rounded-xl font-semibold 
                     transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Join Us
          </Button>
        </div>
      </div>
    </section>
  );
}

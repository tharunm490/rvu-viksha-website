import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Code } from "lucide-react";
import { teamData } from "@/data/team";

export default function Team() {
  const [location] = useLocation();
  const [year, setYear] = useState("2025");
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);

  // Sync the year from the URL query parameter if present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const yearParam = params.get("year");
    if (yearParam && teamData[yearParam]) {
      setYear(yearParam);
    }
  }, [location]);

  return (
    <Layout>
      <br />
      <br />
      <div className="text-white">
        <section className="w-full py-10">
          <div className="text-center mb-10 sm:mb-12 lg:mb-16">
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-semibold text-white mb-6">
              &lt;The Core Team /&gt;
            </h1>
            <p className="mt-4 text-base sm:text-lg lg:text-xl text-blue-100">
              Every club is powered by its people - these are ours!
            </p>

            <div className="flex justify-center gap-4 mt-8">
              {Object.keys(teamData).sort().map((y) => (
                <Button
                  key={y}
                  onClick={() => {
                    setYear(y);
                    setFlippedIndex(null);
                  }}
                  className={`px-8 py-2 rounded-xl font-bold transition-all duration-300 transform ${year === y
                    ? "bg-[rgba(0,40,60,0.7)] border border-[rgba(70,197,212,0.5)] text-[rgba(70,197,212,0.9)] scale-110 shadow-[0_0_20px_rgba(0,180,255,0.3)]"
                    : "bg-[rgba(0,40,60,0.2)] border border-[rgba(70,197,212,0.1)] text-white/40 hover:bg-[rgba(0,40,60,0.4)]"
                    }`}
                >
                  {y}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 px-12 sm:px-24 lg:px-48">
            {teamData[year].map((member, index) => (
              <div
                key={index}
                className="relative w-full h-[22rem] sm:h-[25rem] cursor-pointer"
                onClick={() => setFlippedIndex(flippedIndex === index ? null : index)}
              >
                <div
                  className="relative w-full h-full transition-transform duration-500"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: flippedIndex === index ? "rotateY(180deg)" : "rotateY(0deg)",
                  }}
                >
                  <div
                    className="absolute inset-0 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg flex flex-col justify-end p-3 sm:p-4 text-center"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    {member.img ? (
                      <img
                        src={member.img}
                        alt={member.name}
                        className="w-full h-56 sm:h-64 object-cover rounded-lg mb-2 sm:mb-3 shadow-md"
                      />
                    ) : (
                      <div className="w-full h-56 sm:h-64 rounded-lg mb-2 sm:mb-3 shadow-inner bg-white/5 flex items-center justify-center border border-white/10">
                        <Code className="w-16 h-16 text-white/20" />
                      </div>
                    )}
                    <h3 className="text-lg sm:text-xl font-bold text-white">{member.name}</h3>
                    <p className="text-xs sm:text-sm text-blue-200">{member.role}</p>
                  </div>

                  <div
                    className="absolute inset-0 rounded-2xl bg-[#050a15]/95 backdrop-blur-md border border-white/20 shadow-inner flex items-center justify-center p-4 sm:p-6 text-center"
                    style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
                  >
                    <p className="text-sm sm:text-base text-white">{member.details}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}
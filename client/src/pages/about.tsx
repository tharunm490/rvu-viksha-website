import Layout from "@/components/Layout";

export default function About() {
  return (
    <Layout backgroundType="glow">
      <br />
      <br />
      <div className="animate-in fade-in duration-1000">
        {/* Header */}
        <section className="relative px-7 lg:px-8 py-10 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold bg-gradient-to-b from-white via-white/90 to-cyan-400 bg-clip-text text-transparent mb-6">
            About Us
          </h1>
          <p className="text-gray-200 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
            Know more about who we are, our mission, and our vision for the future.
          </p>
        </section>

        {/* About Us Cards */}
        <section className="px-4 lg:px-8 pb-16 flex justify-center">
          <div className="w-full max-w-6xl grid gap-10 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
            {/* Who are we? */}
            <div className="rounded-3xl backdrop-blur-xl bg-gradient-to-br from-[#0f172a]/80 to-[#1e293b]/70 
              border border-white/10 shadow-md 
              p-10 sm:p-12 text-center hover:scale-105 hover:shadow-[0_8px_30px_rgba(0,200,255,0.1)] 
              transition-all duration-500 w-full max-w-md">
              <h3 className="text-2xl sm:text-3xl font-bold text-white-400 mb-6">
                Who are we?
              </h3>
              <p className="text-gray-300 leading-relaxed text-base sm:text-lg">
                The Viksha Coding Club provides a gateway for students to join the coding community.
                We offer mentorship and a platform to help students enhance their coding skills,
                ensuring everyone has the opportunity to learn and grow with confidence.
              </p>
            </div>

            {/* Our Mission */}
            <div className="rounded-3xl backdrop-blur-xl bg-gradient-to-br from-[#0f172a]/80 to-[#1e293b]/70 
              border border-white/10 shadow-md 
              p-10 sm:p-12 text-center hover:scale-105 hover:shadow-[0_8px_30px_rgba(0,200,255,0.1)] 
              transition-all duration-500 w-full max-w-md">
              <h3 className="text-2xl sm:text-3xl font-bold text-white-400 mb-6">
                Our Mission
              </h3>
              <p className="text-gray-300 leading-relaxed text-base sm:text-lg">
                We aim to foster a culture of learning and innovation by empowering students with
                the skills to excel in development, competitive coding, open-source contributions,
                and emerging technologies.
              </p>
            </div>

            {/* Our Vision */}
            <div className="rounded-3xl backdrop-blur-xl bg-gradient-to-br from-[#0f172a]/80 to-[#1e293b]/70 
              border border-white/10 shadow-md 
              p-10 sm:p-12 text-center hover:scale-105 hover:shadow-[0_8px_30px_rgba(0,200,255,0.1)] 
              transition-all duration-500 w-full max-w-md">
              <h3 className="text-2xl sm:text-3xl font-bold text-white-400 mb-6">
                Our Vision
              </h3>
              <p className="text-gray-300 leading-relaxed text-base sm:text-lg">
                We envision an inclusive environment where students collaborate, innovate,
                and grow together as problem-solvers and developers, building impactful projects
                for the real world.
              </p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}

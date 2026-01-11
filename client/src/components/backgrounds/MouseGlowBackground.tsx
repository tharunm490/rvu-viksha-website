import { useEffect, useState } from "react";

export default function MouseGlowBackground() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden animate-bg-pulse">
            <style>{`
        @keyframes bgPulse {
          0% { background-color: #0a0a0a; }
          25% { background-color: #001428; }
          50% { background-color: #001818; }
          75% { background-color: #050a15; }
          100% { background-color: #0a0a0a; }
        }
        .animate-bg-pulse {
          animation: bgPulse 10s ease-in-out infinite;
        }
      `}</style>
            <div
                className="absolute inset-0 transition-opacity duration-300"
                style={{
                    background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.07), transparent 70%)`
                }}
            />
        </div>
    );
}

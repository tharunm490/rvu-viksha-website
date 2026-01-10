import { useEffect, useRef } from 'react';

export default function CodingBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const symbolsRef = useRef<Array<{
        x: number;
        y: number;
        vy: number;
        vx: number;
        text: string;
        fontSize: number;
        opacity: number;
        rotation: number;
        rotationSpeed: number;
    }>>([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const symbols = ['</>', '{}', '()', ';', '[]', '=>', '&&', '||', '!', '?', ':', 'const', 'let', 'if', 'else', 'return', 'async', 'await'];

        const initSymbols = () => {
            symbolsRef.current = [];
            // Slightly increased count for better visibility
            const symbolCount = Math.min(45, Math.floor(window.innerWidth / 50));

            for (let i = 0; i < symbolCount; i++) {
                symbolsRef.current.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vy: (Math.random() - 0.5) * 1.5, // much more drift
                    vx: (Math.random() - 0.5) * 1.5, // much more drift
                    text: symbols[Math.floor(Math.random() * symbols.length)],
                    fontSize: Math.random() * 12 + 10,
                    opacity: Math.random() * 0.2 + 0.05,
                    rotation: Math.random() * Math.PI * 2,
                    rotationSpeed: (Math.random() - 0.5) * 0.01 // faster rotation
                });
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update + draw symbols
            symbolsRef.current.forEach(symbol => {
                symbol.y += symbol.vy;
                symbol.x += symbol.vx;
                symbol.rotation += symbol.rotationSpeed;

                // reset if out of screen (wrap around like space)
                if (symbol.y < -50) symbol.y = canvas.height + 50;
                if (symbol.y > canvas.height + 50) symbol.y = -50;
                if (symbol.x < -50) symbol.x = canvas.width + 50;
                if (symbol.x > canvas.width + 50) symbol.x = -50;

                ctx.save();
                ctx.translate(symbol.x, symbol.y);
                ctx.rotate(symbol.rotation);
                ctx.font = `${symbol.fontSize}px 'JetBrains Mono', 'Fira Code', monospace`;

                ctx.fillStyle = `rgba(255, 255, 255, ${symbol.opacity})`;
                ctx.shadowColor = 'rgba(255, 255, 255, 0.2)';

                ctx.shadowBlur = 10;
                ctx.fillText(symbol.text, 0, 0);
                ctx.restore();
            });

            requestAnimationFrame(animate);
        };

        resizeCanvas();
        initSymbols();
        animate();

        const handleResize = () => {
            resizeCanvas();
            initSymbols();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
        />
    );
}

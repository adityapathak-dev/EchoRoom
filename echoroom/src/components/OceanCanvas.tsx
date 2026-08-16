import { useEffect, useRef } from "react";

/**
 * Interactive Ocean Canvas Background.
 * Renders drifting ocean bubbles, glowing plankton particles,
 * soft underwater light rays, and current flow lines.
 *
 * Performant HTML5 Canvas implementation respecting prefers-reduced-motion.
 */
export default function OceanCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener("resize", resize);

    // Create 35 drifting ocean particles (bubbles + plankton)
    const particleCount = prefersReducedMotion ? 12 : 35;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * (canvas?.width ?? 1200),
      y: Math.random() * (canvas?.height ?? 800),
      radius: Math.random() * 4 + 1.5,
      speedY: (Math.random() * 0.4 + 0.1) * (prefersReducedMotion ? 0 : 1),
      speedX: (Math.sin(Math.random() * Math.PI * 2) * 0.2) * (prefersReducedMotion ? 0 : 1),
      opacity: Math.random() * 0.4 + 0.15,
      pulse: Math.random() * Math.PI * 2,
    }));

    function draw() {
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw subtle underwater light rays from top-right
      const gradient = ctx.createLinearGradient(
        canvas.width * 0.7,
        0,
        canvas.width * 0.3,
        canvas.height,
      );
      gradient.addColorStop(0, "rgba(103, 232, 249, 0.08)");
      gradient.addColorStop(0.5, "rgba(34, 211, 238, 0.03)");
      gradient.addColorStop(1, "rgba(240, 253, 255, 0)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw drifting ocean particles
      particles.forEach((p) => {
        p.y -= p.speedY;
        p.x += Math.sin(p.pulse) * 0.2;
        p.pulse += 0.01;

        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(14, 165, 233, ${p.opacity})`;
        ctx.fill();

        // Subtle glow ring around larger particles
        if (p.radius > 3) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius + 2, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(34, 211, 238, ${p.opacity * 0.4})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(draw);
      }
    }

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}

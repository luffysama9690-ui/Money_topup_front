import { useRef, useEffect } from "react";

/**
 * FallingStars — canvas-based falling/twinkling star background.
 * Renders behind its sibling content; place as the first child of a
 * position:relative container with a dark background.
 */
export default function FallingStars({ count = 100, color = "#ffffff", speed = 0.8 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationId;
    let stars = [];

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    function createStars() {
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.3,
        fallSpeed: (Math.random() * 0.5 + 0.3) * speed,
        opacity: Math.random() * 0.6 + 0.4,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((s) => {
        s.y += s.fallSpeed;
        if (s.y > canvas.height) {
          s.y = -5;
          s.x = Math.random() * canvas.width;
        }
        s.twinklePhase += s.twinkleSpeed;
        const flicker = (Math.sin(s.twinklePhase) + 1) / 2;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = s.opacity * (0.5 + flicker * 0.5);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(draw);
    }

    const handleResize = () => {
      resize();
      createStars();
    };

    resize();
    createStars();
    draw();
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, [count, color, speed]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}

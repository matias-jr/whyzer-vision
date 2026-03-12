import { useEffect, useRef, useCallback } from 'react';

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

interface Particle {
  x: number;
  y: number;
  speed: number;
  char: string;
  opacity: number;
  color: string;
}

const HeroCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const smoothMouse = useRef({ x: 0.5, y: 0.5 });
  const scrollRef = useRef(0);
  const particlesRef = useRef<Particle[]>([]);
  const ringsRef = useRef([0, 0, 0]);
  const animFrameRef = useRef<number>(0);

  const chars = '0123456789ABCDEFabcdef$%@#&+=<>{}[]|/\\~^'.split('');

  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = [];
    for (let i = 0; i < 200; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        speed: 0.3 + Math.random() * 1.2,
        char: chars[Math.floor(Math.random() * chars.length)],
        opacity: 0.03 + Math.random() * 0.06,
        color: Math.random() > 0.6 ? '#999999' : '#C8C8C8',
      });
    }
    particlesRef.current = particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (particlesRef.current.length === 0) {
        initParticles(canvas.width, canvas.height);
      }
    };

    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX / window.innerWidth;
      mouseRef.current.y = e.clientY / window.innerHeight;
    };

    const handleScroll = () => {
      scrollRef.current = window.scrollY / (window.innerHeight * 0.8);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    const ringSpeeds = [0.0008, 0.0005, 0.0012];

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;

      smoothMouse.current.x = lerp(smoothMouse.current.x, mouseRef.current.x, 0.06);
      smoothMouse.current.y = lerp(smoothMouse.current.y, mouseRef.current.y, 0.06);

      ctx.clearRect(0, 0, w, h);

      // Subtle grey gradient
      const bgGrad = ctx.createRadialGradient(w * 0.3, h * 0.5, 0, w * 0.3, h * 0.5, w * 0.6);
      bgGrad.addColorStop(0, 'rgba(200,200,200,0.04)');
      bgGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      const bgGrad2 = ctx.createRadialGradient(w * 0.8, h * 0.2, 0, w * 0.8, h * 0.2, w * 0.5);
      bgGrad2.addColorStop(0, 'rgba(150,150,150,0.03)');
      bgGrad2.addColorStop(1, 'transparent');
      ctx.fillStyle = bgGrad2;
      ctx.fillRect(0, 0, w, h);

      // Draw particles
      ctx.font = '12px JetBrains Mono, monospace';
      particlesRef.current.forEach((p) => {
        p.y += p.speed;
        if (p.y > h) {
          p.y = -20;
          p.x = Math.random() * w;
          p.char = chars[Math.floor(Math.random() * chars.length)];
        }
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.fillText(p.char, p.x, p.y);
      });

      ctx.globalAlpha = 1;

      // Draw orbital rings
      const cx = w / 2 + (smoothMouse.current.x - 0.5) * 60;
      const cy = h / 2 + (smoothMouse.current.y - 0.5) * 40;

      const ringRadii = [Math.min(w, h) * 0.28, Math.min(w, h) * 0.35, Math.min(w, h) * 0.42];
      const ringColors = ['rgba(200,200,200,0.10)', 'rgba(150,150,150,0.06)', 'rgba(200,200,200,0.04)'];

      ringsRef.current = ringsRef.current.map((angle, i) => angle + ringSpeeds[i]);

      ringsRef.current.forEach((angle, i) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);

        const tiltX = (smoothMouse.current.y - 0.5) * 0.3;

        ctx.beginPath();
        ctx.ellipse(0, 0, ringRadii[i], ringRadii[i] * (0.3 + tiltX * 0.2), 0, 0, Math.PI * 2);
        ctx.strokeStyle = ringColors[i];
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.shadowColor = 'rgba(200,200,200,0.15)';
        ctx.shadowBlur = 20;
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.restore();
      });

      // Vignette
      const vignetteGrad = ctx.createRadialGradient(w / 2, h / 2, w * 0.2, w / 2, h / 2, w * 0.7);
      vignetteGrad.addColorStop(0, 'transparent');
      vignetteGrad.addColorStop(1, 'rgba(30,30,30,0.9)');
      ctx.fillStyle = vignetteGrad;
      ctx.fillRect(0, 0, w, h);

      animFrameRef.current = requestAnimationFrame(draw);
    };

    animFrameRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  );
};

export default HeroCanvas;

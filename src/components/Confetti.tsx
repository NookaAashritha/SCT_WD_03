import { useEffect, useState, memo } from 'react';

interface Particle {
  id: number;
  x: number;
  color: string;
  size: number;
  duration: number;
  delay: number;
}

const COLORS = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];

// Create confetti particles
const createParticles = (count: number): Particle[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    size: Math.random() * 10 + 5,
    duration: Math.random() * 2 + 2,
    delay: Math.random() * 0.5
  }));
};

interface ConfettiProps {
  isActive: boolean;
}

const ConfettiParticle = memo(({ particle }: { particle: Particle }) => (
  <div
    className="absolute top-0 w-3 h-3 opacity-0 animate-confetti"
    style={{
      left: `${particle.x}%`,
      width: `${particle.size}px`,
      height: `${particle.size}px`,
      backgroundColor: particle.color,
      animationDuration: `${particle.duration}s`,
      animationDelay: `${particle.delay}s`,
      transform: `rotate(${Math.random() * 360}deg)`,
    }}
  />
));

export function Confetti({ isActive }: ConfettiProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (isActive) {
      setParticles(createParticles(50));
      const timer = setTimeout(() => setParticles([]), 4000);
      return () => clearTimeout(timer);
    } else {
      setParticles([]);
    }
  }, [isActive]);

  if (!isActive || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map(particle => (
        <ConfettiParticle key={particle.id} particle={particle} />
      ))}
    </div>
  );
}

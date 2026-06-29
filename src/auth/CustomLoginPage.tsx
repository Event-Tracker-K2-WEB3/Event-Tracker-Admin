import { FormEvent, useEffect, useState, MouseEvent } from "react";
import { useLogin, useNotify } from "react-admin";
import "./CustomLoginPage.css";

function useCountUp(target: number, duration = 1600) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frame: number;
    const start = performance.now();

    const animate = (time: number) => {
      const progress = Math.min((time - start) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      setValue(Math.floor(target * easedProgress));

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
}

function StatCard({
  label,
  value,
  suffix,
  delay,
}: {
  label: string;
  value: number;
  suffix?: string;
  delay: string;
}) {
  const count = useCountUp(value);

  return (
    <div className="login-stat-card" style={{ animationDelay: delay }}>
      <div>
        <p>{label}</p>
        <strong>
          {suffix === "$" ? "$" : ""}
          {count.toLocaleString("en-US")}
          {suffix && suffix !== "$" ? suffix : ""}
        </strong>
      </div>

      <span>↗</span>
    </div>
  );
}

function LeftNetworkAnimation() {
  return (
    <div className="login-network">
      <div className="network-ring ring-one" />
      <div className="network-ring ring-two" />
      <div className="network-ring ring-three" />

      <span className="network-dot dot-one" />
      <span className="network-dot dot-two" />
      <span className="network-dot dot-three" />
      <span className="network-dot dot-four" />

      <svg className="network-lines" viewBox="0 0 300 300">
        <line x1="80" y1="140" x2="145" y2="80" />
        <line x1="145" y1="80" x2="220" y2="125" />
        <line x1="80" y1="140" x2="190" y2="210" />
        <line x1="220" y1="125" x2="190" y2="210" />
      </svg>
    </div>
  );
}

function RightWaveAnimation() {
  return (
    <div className="login-wave">
      {Array.from({ length: 12 }).map((_, index) => (
        <span key={index} style={{ animationDelay: `${index * 90}ms` }} />
      ))}
    </div>
  );
}

function PasswordEyeToggle({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) {
  const [pupilPosition, setPupilPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event: MouseEvent<HTMLButtonElement>) => {
    if (!isOpen) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();

    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const maxMove = 4;

    const x = Math.max(
      -maxMove,
      Math.min(maxMove, ((mouseX - centerX) / centerX) * maxMove)
    );

    const y = Math.max(
      -maxMove,
      Math.min(maxMove, ((mouseY - centerY) / centerY) * maxMove)
    );

    setPupilPosition({ x, y });
  };

  const resetEye = () => {
    setPupilPosition({ x: 0, y: 0 });
  };

  return (
    <button
      type="button"
      className={`animated-eye-toggle ${isOpen ? "is-open" : "is-closed"}`}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetEye}
      aria-label={isOpen ? "Hide password" : "Show password"}
    >
      <span className="eye-shape">
        <span className="eye-lid" />

        <span
          className="eye-iris"
          style={{
            transform: `translate(${pupilPosition.x}px, ${pupilPosition.y}px)`,
          }}
        >
          <span className="eye-pupil" />
          <span className="eye-shine" />
        </span>
      </span>
    </button>
  );
}

export function CustomLoginPage() {
  const login = useLogin();
  const notify = useNotify();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await login({ email, password });
    } catch {
      notify("Invalid email or password", { type: "error" });
      setIsSubmitting(false);
    }
  };

  return (
    <main className="custom-login-page">
      <LeftNetworkAnimation />
      <RightWaveAnimation />

      <div className="login-stats login-stats-left">
        <StatCard label="Events" value={1248} delay="400ms" />
        <StatCard label="Registrations" value={24532} delay="650ms" />
        <StatCard label="Revenue" value={48920} suffix="$" delay="900ms" />
      </div>

      <div className="login-chart-card">
        <p>Registrations overview</p>
        <strong>{useCountUp(24532).toLocaleString("en-US")}</strong>
        <svg viewBox="0 0 340 120">
          <path
            className="chart-line"
            d="M10 95 C45 75, 60 85, 90 60 C120 35, 135 75, 165 48 C195 22, 210 62, 240 38 C270 12, 300 35, 330 10"
          />
        </svg>
      </div>

      <section className="login-card">
        <div className="login-lock">
          <span>
                  <span className="text-white">Event</span>
                  <span className="text-violet-400">Sync</span>
          </span>
        </div>
        <p className="login-admin-label">ADMIN</p>

        <form onSubmit={handleSubmit} className="login-form">
          <label>
            Email
            <div className="login-input-wrapper">
              <span>♙</span>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="text"
                placeholder="Enter your email"
                autoComplete="email"
                required
              />
            </div>
          </label>

          <label>
            Password
            <div className="login-input-wrapper">
              <span>⌕</span>
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />

              <PasswordEyeToggle
                isOpen={showPassword}
                onClick={() => setShowPassword((current) => !current)}
              />
            </div>
          </label>

          <button type="submit" className="login-submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign in"}
            <span>→</span>
          </button>
        </form>
      </section>

      <footer className="login-footer">
        © 2026 <span>EventSync</span>. All rights reserved.
      </footer>
    </main>
  );
}
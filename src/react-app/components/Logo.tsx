import { useEffect, useRef, useState } from "react";

/**
 * LAI Logo — "The Glyph"
 *
 * Concept: The scales of justice abstracted into a living sigil.
 * Two luminous arcs (the pans) orbit a central axis (the pillar).
 * A plasma aurora breathes beneath the mark. Dual-tone: electric
 * cyan meets deep violet. Zero clip-art. Pure visual tension.
 *
 * Usage:
 *   <Logo />                           // md, with text
 *   <Logo size="sm" showText={false} /> // icon only
 *   <Logo size="lg" />
 */

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

const SIZES = {
  sm: { box: 32, textSize: 13, gap: 8 },
  md: { box: 40, textSize: 16, gap: 10 },
  lg: { box: 58, textSize: 23, gap: 14 },
};

export function Logo({ size = "md", showText = true }: LogoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frame = useRef(0);
  const raf = useRef(0);
  const [ready, setReady] = useState(false);
  const s = SIZES[size];

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;
    const D = s.box;
    canvas.width = D * dpr;
    canvas.height = D * dpr;
    canvas.style.width = `${D}px`;
    canvas.style.height = `${D}px`;
    ctx.scale(dpr, dpr);

    const draw = () => {
      const f = frame.current;
      const t = f / 60;
      const cx = D / 2,
        cy = D / 2;

      ctx.clearRect(0, 0, D, D);

      /* ── 1. Aurora background orb ──────────────────────────── */
      const auraR = D * 0.52;
      const pulse = 0.78 + 0.22 * Math.sin(t * 0.9);

      const aura1 = ctx.createRadialGradient(
        cx + Math.sin(t * 0.7) * D * 0.08,
        cy + Math.cos(t * 0.5) * D * 0.07,
        0,
        cx,
        cy,
        auraR * pulse,
      );
      aura1.addColorStop(0, "rgba(99,179,255,0.28)");
      aura1.addColorStop(0.4, "rgba(100,80,255,0.18)");
      aura1.addColorStop(1, "rgba(0,0,0,0)");

      ctx.beginPath();
      ctx.ellipse(
        cx,
        cy,
        auraR * pulse,
        auraR * pulse * 0.9,
        t * 0.2,
        0,
        Math.PI * 2,
      );
      ctx.fillStyle = aura1;
      ctx.fill();

      /* ── 2. Outer hex ring ────────────────────────────────── */
      const hexR = D * 0.44;
      const hexA = t * 0.12;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = hexA + (i / 6) * Math.PI * 2;
        const x = cx + Math.cos(a) * hexR;
        const y = cy + Math.sin(a) * hexR;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = "rgba(99,179,255,0.12)";
      ctx.lineWidth = 0.8;
      ctx.stroke();

      /* ── 3. The Central Axis ─────────────────────────────── */
      const axisH = D * 0.52;
      const axisY0 = cy - axisH / 2;
      const axisY1 = cy + axisH / 2;
      const axisW = D * 0.038;

      const axisGrad = ctx.createLinearGradient(cx, axisY0, cx, axisY1);
      axisGrad.addColorStop(0, "rgba(120,200,255,0)");
      axisGrad.addColorStop(0.2, "rgba(120,200,255,0.9)");
      axisGrad.addColorStop(0.5, "#ffffff");
      axisGrad.addColorStop(0.8, "rgba(160,120,255,0.9)");
      axisGrad.addColorStop(1, "rgba(160,120,255,0)");

      ctx.save();
      ctx.shadowColor = "rgba(100,160,255,0.6)";
      ctx.shadowBlur = D * 0.12;
      ctx.beginPath();
      ctx.roundRect(cx - axisW / 2, axisY0, axisW, axisH, axisW / 2);
      ctx.fillStyle = axisGrad;
      ctx.fill();
      ctx.restore();

      /* ── 4. The Two Arcs ──────────────────────────────────── */
      const arcRadius = D * 0.26;
      const arcSpread = D * 0.27;
      const arcAngle = Math.PI * 0.68;

      const swayL = Math.sin(t * 0.8) * D * 0.025;
      const swayR = -Math.sin(t * 0.8) * D * 0.025;

      const drawArc = (
        ox: number,
        oy: number,
        color1: string,
        color2: string,
        flip: boolean,
      ) => {
        const startA = flip
          ? -(Math.PI / 2) - arcAngle / 2
          : Math.PI / 2 - arcAngle / 2;
        const endA = startA + arcAngle;

        ctx.save();
        ctx.shadowColor = color1;
        ctx.shadowBlur = D * 0.18;
        ctx.beginPath();
        ctx.arc(ox, oy, arcRadius, startA, endA);
        ctx.strokeStyle = color1;
        ctx.lineWidth = D * 0.055;
        ctx.lineCap = "round";
        ctx.stroke();
        ctx.restore();

        const arcGrad = ctx.createLinearGradient(
          ox + Math.cos(startA) * arcRadius,
          oy + Math.sin(startA) * arcRadius,
          ox + Math.cos(endA) * arcRadius,
          oy + Math.sin(endA) * arcRadius,
        );
        arcGrad.addColorStop(0, "rgba(255,255,255,0)");
        arcGrad.addColorStop(0.35, color2);
        arcGrad.addColorStop(0.65, "#ffffff");
        arcGrad.addColorStop(1, "rgba(255,255,255,0)");

        ctx.beginPath();
        ctx.arc(ox, oy, arcRadius, startA, endA);
        ctx.strokeStyle = arcGrad;
        ctx.lineWidth = D * 0.028;
        ctx.lineCap = "round";
        ctx.stroke();

        const ex = ox + Math.cos((startA + endA) / 2) * arcRadius;
        const ey = oy + Math.sin((startA + endA) / 2) * arcRadius;
        const dotPulse = 0.6 + 0.4 * Math.sin(t * 2 + (flip ? Math.PI : 0));
        ctx.save();
        ctx.shadowColor = color1;
        ctx.shadowBlur = D * 0.22;
        ctx.beginPath();
        ctx.arc(ex, ey, D * 0.045 * dotPulse, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.restore();
      };

      drawArc(
        cx - arcSpread,
        cy + swayL,
        "rgba(56,189,248,0.7)",
        "#7dd3fc",
        false,
      );
      drawArc(
        cx + arcSpread,
        cy + swayR,
        "rgba(167,139,250,0.7)",
        "#c4b5fd",
        true,
      );

      /* ── 5. Horizontal connector ─────────────────────────── */
      const connGrad = ctx.createLinearGradient(
        cx - arcSpread,
        cy,
        cx + arcSpread,
        cy,
      );
      connGrad.addColorStop(0, "rgba(56,189,248,0)");
      connGrad.addColorStop(0.3, "rgba(56,189,248,0.55)");
      connGrad.addColorStop(0.5, "rgba(255,255,255,0.5)");
      connGrad.addColorStop(0.7, "rgba(167,139,250,0.55)");
      connGrad.addColorStop(1, "rgba(167,139,250,0)");

      ctx.save();
      ctx.shadowColor = "rgba(160,180,255,0.4)";
      ctx.shadowBlur = D * 0.08;
      ctx.beginPath();
      ctx.moveTo(cx - arcSpread - D * 0.02, cy);
      ctx.lineTo(cx + arcSpread + D * 0.02, cy);
      ctx.strokeStyle = connGrad;
      ctx.lineWidth = D * 0.022;
      ctx.stroke();
      ctx.restore();

      /* ── 6. Center node ──────────────────────────────────── */
      const nodePulse = 0.7 + 0.3 * Math.sin(t * 1.6);
      ctx.save();
      ctx.shadowColor = "rgba(180,200,255,0.9)";
      ctx.shadowBlur = D * 0.22 * nodePulse;
      ctx.beginPath();
      ctx.arc(cx, cy, D * 0.055 * nodePulse, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.restore();

      /* ── 7. Particle sparks ──────────────────────────────── */
      for (let i = 0; i < 3; i++) {
        const pa = t * (0.6 + i * 0.3) + (i * Math.PI * 2) / 3;
        const pr = D * (0.38 + 0.04 * Math.sin(t + i));
        const px = cx + Math.cos(pa) * pr;
        const py = cy + Math.sin(pa) * pr * 0.55;
        const alpha = 0.3 + 0.4 * Math.sin(t * 1.5 + i);
        const colors = [
          "rgba(56,189,248,",
          "rgba(255,255,255,",
          "rgba(167,139,250,",
        ];
        ctx.beginPath();
        ctx.arc(px, py, D * 0.028, 0, Math.PI * 2);
        ctx.fillStyle = `${colors[i]}${alpha})`;
        ctx.fill();
      }

      frame.current++;
      raf.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(raf.current);
  }, [size]);

  return (
    <>
      {ready && (
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@800&display=swap');
          .lai-root { display:inline-flex; align-items:center; user-select:none; }
          .lai-name {
            font-family: 'Outfit', sans-serif;
            font-weight: 800;
            letter-spacing: 0.12em;
            background: linear-gradient(100deg, #7dd3fc 0%, #ffffff 45%, #c4b5fd 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            line-height: 1;
          }
        `}</style>
      )}

      <div className="lai-root" style={{ gap: s.gap }}>
        <canvas ref={canvasRef} style={{ display: "block", flexShrink: 0 }} />
        {showText && (
          <span className="lai-name" style={{ fontSize: s.textSize }}>
            LAI
          </span>
        )}
      </div>
    </>
  );
}

/* ── Showcase ──────────────────────────────────────────────────────────────── */
export default function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0D1117",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 64,
        padding: 48,
      }}
    >
      <style>{`body{margin:0} *{box-sizing:border-box}`}</style>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 40,
        }}
      >
        <Logo size="lg" />
        <Logo size="md" />
        <Logo size="sm" />
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: 480,
          height: 1,
          background: "rgba(255,255,255,0.05)",
        }}
      />

      <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
        <Logo size="lg" showText={false} />
        <Logo size="md" showText={false} />
        <Logo size="sm" showText={false} />
      </div>

      <div
        style={{
          background: "#111827",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 16,
          padding: "24px 36px",
          display: "flex",
          alignItems: "center",
          gap: 48,
        }}
      >
        <Logo size="md" showText={true} />
        <Logo size="sm" showText={true} />
        <Logo size="md" showText={false} />
      </div>
    </div>
  );
}

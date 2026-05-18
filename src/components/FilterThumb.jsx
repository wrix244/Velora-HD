import { useEffect, useRef } from "react";

export default function FilterThumb({ filter, srcImg, size = 72, selected, onClick }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !srcImg) return;

    canvas.width = size * 2;
    canvas.height = size * 2;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.filter = filter.cssFilter === "none" ? "none" : filter.cssFilter;
    ctx.drawImage(srcImg, 0, 0, size * 2, size * 2);
    ctx.filter = "none";

    if (filter.vigStrength > 0) {
      const [vr, vg, vb] = filter.vigColor || [0, 0, 0];
      const vignette = ctx.createRadialGradient(size, size, size * 0.18, size, size, size * 0.9);
      vignette.addColorStop(0, "rgba(0,0,0,0)");
      vignette.addColorStop(1, `rgba(${vr},${vg},${vb},${filter.vigStrength * 0.85})`);
      ctx.globalCompositeOperation = "multiply";
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, size * 2, size * 2);
      ctx.globalCompositeOperation = "source-over";
    }
  }, [srcImg, filter, size]);

  return (
    <div onClick={onClick} style={{ cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: 14,
          overflow: "hidden",
          border: selected ? "2.5px solid #5dbb63" : "2.5px solid transparent",
          boxShadow: selected ? "0 0 0 1px #5dbb6366" : "none",
          transition: "all 0.18s",
          background: "#1c2b1e",
          flexShrink: 0,
        }}
      >
        {srcImg ? (
          <canvas ref={ref} style={{ width: "100%", height: "100%", display: "block" }} />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: `linear-gradient(135deg, ${filter.preview}, #1c2b1e)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
            }}
          >
            {filter.emoji}
          </div>
        )}
      </div>
      <div
        style={{
          fontSize: 10,
          color: selected ? "#5dbb63" : "rgba(255,255,255,0.45)",
          fontWeight: selected ? 600 : 400,
          letterSpacing: "0.03em",
          textAlign: "center",
          maxWidth: size,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {filter.name}
      </div>
    </div>
  );
}

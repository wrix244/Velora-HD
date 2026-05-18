export default function FontsSidebar({ fonts, activeFont, onFontSelect }) {
  return (
    <aside
      style={{
        width: 160,
        minWidth: 160,
        flexShrink: 0,
        borderLeft: "1px solid rgba(255,255,255,0.08)",
        overflowY: "auto",
        padding: "18px 14px",
        background: "rgba(5,24,16,0.94)",
        boxShadow: "inset 0 0 0 1px rgba(98, 222, 169, 0.08)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div style={{ fontSize: 9, color: "rgba(255,255,255,0.22)", letterSpacing: "0.18em", marginBottom: 10 }}>
        FONTS
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {fonts.map((font) => (
          <div
            key={font.id}
            className={`font-card${activeFont.id === font.id ? " sel" : ""}`}
            onClick={() => onFontSelect(font)}
          >
            <div style={{ ...font.style, fontSize: 17, color: activeFont.id === font.id ? "#5dbb63" : "rgba(255,255,255,0.75)", marginBottom: 4 }}>
              {font.sample}
            </div>
            <div style={{ fontFamily: "system-ui", fontSize: 9, color: "rgba(255,255,255,0.28)", letterSpacing: "0.08em" }}>
              {font.name}
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16, padding: "10px", borderRadius: 10, background: "rgba(93,187,99,0.06)", border: "1px solid rgba(93,187,99,0.12)" }}>
        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.22)", letterSpacing: "0.12em", marginBottom: 8 }}>
          PREVIEW
        </div>
        <div style={{ ...activeFont.style, fontSize: 15, color: "#a8dba8", textAlign: "center" }}>
          DreamLens
        </div>
      </div>
    </aside>
  );
}

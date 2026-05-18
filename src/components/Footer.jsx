export default function Footer({ filters, activeFilter, onFilterSelect }) {
  return (
    <footer style={{ borderTop: "1px solid rgba(255,255,255,0.07)", background: "rgba(8,14,9,0.95)", padding: "28px 32px 20px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 32, justifyContent: "space-between" }}>
        <div style={{ maxWidth: 260 }}>
          <div style={{ fontSize: 16, fontWeight: 300, letterSpacing: "0.1em", color: "#a8dba8", marginBottom: 6 }}>
            dream<span style={{ color: "#5dbb63", fontStyle: "italic" }}>lens</span>
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.28)", lineHeight: 1.7 }}>
            Cinematic film filters crafted for nature photography. Upload, filter, and download — no account needed.
          </div>
        </div>

        <div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.22)", letterSpacing: "0.16em", marginBottom: 10 }}>
            FILTERS
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 20px" }}>
            {filters.slice(1).map((filter) => (
              <div
                key={filter.id}
                style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", cursor: "pointer", padding: "2px 0" }}
                onClick={() => onFilterSelect(filter)}
              >
                {filter.emoji} {filter.name}
              </div>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.22)", letterSpacing: "0.16em", marginBottom: 10 }}>
            HOW IT WORKS
          </div>
          {[
            "Upload any nature photo",
            "Pick a cinematic filter",
            "Compare before & after",
            "Export full-resolution PNG",
          ].map((step, index) => (
            <div key={step} style={{ fontSize: 11, color: "rgba(255,255,255,0.32)", marginBottom: 6, display: "flex", gap: 8, alignItems: "flex-start" }}>
              <span style={{ color: "#5dbb63", fontSize: 10, marginTop: 1 }}>0{index + 1}</span>
              {step}
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "20px auto 0", paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.18)", letterSpacing: "0.1em" }}>
          © 2025 DREAMLENS · ALL FILTERS RUN IN YOUR BROWSER · NO DATA UPLOADED
        </div>
        <div style={{ fontSize: 10, color: "rgba(93,187,99,0.4)", letterSpacing: "0.08em" }}>
          🌿 MADE FOR NATURE
        </div>
      </div>
    </footer>
  );
}

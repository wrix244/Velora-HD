export default function Header({ displayImg, onExport, inputRef, onUploadClick, onFileSelect }) {
  return (
    <header
      style={{
        padding: "14px 22px",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "rgba(14,26,16,0.95)",
        backdropFilter: "blur(12px)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div>
        <div style={{ fontSize: 20, fontWeight: 300, letterSpacing: "0.12em", color: "#a8dba8" }}>
          dream<span style={{ color: "#5dbb63", fontStyle: "italic", fontWeight: 600 }}>lens</span>
          <span
            style={{
              marginLeft: 8,
              fontSize: 11,
              background: "rgba(93,187,99,0.15)",
              color: "#5dbb63",
              border: "1px solid rgba(93,187,99,0.3)",
              borderRadius: 20,
              padding: "2px 9px",
              letterSpacing: "0.1em",
              verticalAlign: "middle",
            }}
          >
            NATURE
          </span>
        </div>
        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.22)", letterSpacing: "0.22em", marginTop: 2 }}>
          CINEMATIC FILM FILTERS FOR NATURE PHOTOS
        </div>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        {displayImg && (
          <button className="btn-primary" onClick={onExport}>
            ↓ Export PNG
          </button>
        )}
        <button className="btn-ghost" onClick={onUploadClick}>
          ↑ Upload Photo
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => onFileSelect(e.target.files?.[0])}
        />
      </div>
    </header>
  );
}

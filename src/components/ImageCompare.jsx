export default function ImageCompare({
  displayImg,
  activeFilter,
  rendering,
  origRef,
  filtRef,
  sliderWrapRef,
  sliderPos,
  setSliderPos,
  dragging,
  setDragging,
  getSliderPct,
  onReset,
  onDownload,
  dragOver,
  setDragOver,
  onFileSelect,
  onUploadClick,
}) {
  return (
    <main
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        overflowY: "auto",
        position: "relative",
        minHeight: 0,
      }}
    >
      <div style={{ width: "100%", maxWidth: 760, minHeight: 480, padding: 18, borderRadius: 24, background: "rgba(6, 16, 12, 0.82)", boxShadow: "0 28px 80px rgba(0, 0, 0, 0.25)", border: "1px solid rgba(115, 228, 164, 0.12)" }}>
      {displayImg && (
        <div
          style={{
            position: "absolute",
            top: 16,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(14,26,16,0.85)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(93,187,99,0.2)",
            borderRadius: 30,
            padding: "6px 16px",
            zIndex: 10,
          }}
        >
          <span style={{ fontSize: 15 }}>{activeFilter.emoji}</span>
          <span style={{ fontSize: 12, color: "#a8dba8", letterSpacing: "0.06em" }}>{activeFilter.name}</span>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.04em" }}>— {activeFilter.tag}</span>
          {rendering && <span style={{ fontSize: 10, color: "rgba(93,187,99,0.6)", marginLeft: 4 }}>rendering…</span>}
        </div>
      )}

      {!displayImg ? (
        <div
          className={`upzone${dragOver ? " dov" : ""}`}
          style={{ width: "100%", maxWidth: 560, height: 400 }}
          onClick={onUploadClick}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            onFileSelect(e.dataTransfer.files[0]);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
        >
          <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.35 }}>🌿</div>
          <div style={{ fontSize: 18, fontWeight: 300, color: "rgba(255,255,255,0.38)", marginBottom: 8 }}>
            Drop your nature photo here
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.18)", letterSpacing: "0.12em" }}>
            OR CLICK TO BROWSE
          </div>
          <div style={{ marginTop: 28, fontSize: 10, color: "rgba(255,255,255,0.14)", letterSpacing: "0.1em" }}>
            JPG · PNG · WEBP
          </div>
        </div>
      ) : (
        <div className="fadeIn" style={{ width: "100%", maxWidth: 720 }}>
          <div
            ref={sliderWrapRef}
            style={{ position: "relative", borderRadius: 16, overflow: "hidden", cursor: "ew-resize", userSelect: "none", lineHeight: 0, boxShadow: "0 24px 60px rgba(0,0,0,0.6)" }}
            onMouseDown={(e) => {
              setDragging(true);
              setSliderPos(getSliderPct(e));
            }}
            onMouseMove={(e) => {
              if (dragging) setSliderPos(getSliderPct(e));
            }}
            onMouseUp={() => setDragging(false)}
            onMouseLeave={() => setDragging(false)}
            onTouchStart={(e) => setSliderPos(getSliderPct(e))}
            onTouchMove={(e) => {
              e.preventDefault();
              setSliderPos(getSliderPct(e));
            }}
          >
            <canvas ref={filtRef} style={{ display: "block", width: "100%", height: "auto", borderRadius: 16 }} />
            <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${100 - sliderPos}% 0 0)`, borderRadius: 16 }}>
              <canvas ref={origRef} style={{ display: "block", width: "100%", height: "auto" }} />
            </div>
            <div style={{ position: "absolute", top: 12, left: 14, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", padding: "3px 11px", borderRadius: 20, fontSize: 10, color: "rgba(255,255,255,0.6)", letterSpacing: "0.08em", pointerEvents: "none" }}>
              ORIGINAL
            </div>
            <div style={{ position: "absolute", top: 12, right: 14, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", padding: "3px 11px", borderRadius: 20, fontSize: 10, color: "#5dbb63", letterSpacing: "0.08em", pointerEvents: "none" }}>
              {activeFilter.name.toUpperCase()}
            </div>
            <div style={{ position: "absolute", top: 0, bottom: 0, left: `${sliderPos}%`, width: 2, background: "rgba(255,255,255,0.88)", transform: "translateX(-50%)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", top: "50%", left: `${sliderPos}%`, transform: "translate(-50%,-50%)", width: 34, height: 34, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 14px rgba(0,0,0,0.55)", cursor: "ew-resize", zIndex: 10, pointerEvents: "none" }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M5 8H11M5 8L3 6M5 8L3 10M11 8L13 6M11 8L13 10" stroke="#0e1a10" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <div style={{ marginTop: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em" }}>← DRAG SLIDER TO COMPARE →</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn-ghost" onClick={onReset}>
                ↺ Reset
              </button>
              <button className="btn-primary" onClick={onDownload}>
                ↓ Save PNG
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </main>
  );
}

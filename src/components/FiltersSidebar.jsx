import FilterThumb from "./FilterThumb";

export default function FiltersSidebar({ filters, displayImg, activeFilter, onFilterSelect }) {
  return (
    <aside
      style={{
        width: 128,
        minWidth: 128,
        flexShrink: 0,
        borderRight: "1px solid rgba(255,255,255,0.08)",
        overflowY: "auto",
        padding: "18px 12px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        background: "rgba(3,23,13,0.92)",
        boxShadow: "inset 0 0 0 1px rgba(80, 222, 146, 0.08)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div style={{ fontSize: 9, color: "rgba(255,255,255,0.22)", letterSpacing: "0.18em", marginBottom: 4, paddingLeft: 2 }}>
        FILTERS
      </div>
      {filters.map((filter) => (
        <FilterThumb
          key={filter.id}
          filter={filter}
          srcImg={displayImg}
          size={80}
          selected={activeFilter.id === filter.id}
          onClick={() => onFilterSelect(filter)}
        />
      ))}
    </aside>
  );
}

import { useState, useRef, useEffect } from "react";
import FILTERS from "./data/filters";
import FONTS from "./data/fonts";
import Header from "./components/Header";
import FiltersSidebar from "./components/FiltersSidebar";
import FontsSidebar from "./components/FontsSidebar";
import ImageCompare from "./components/ImageCompare";
import Footer from "./components/Footer";
import { renderToCanvas } from "./utils/renderUtils";
import "./styles/globals.css";

const SAMPLE_PATH = "/sample.jpg";

export default function App() {
  const [srcImg, setSrcImg] = useState(null);
  const [userImg, setUserImg] = useState(null);
  const [activeFilter, setActiveFilter] = useState(FILTERS[0]);
  const [activeFont, setActiveFont] = useState(FONTS[0]);
  const [sliderPos, setSliderPos] = useState(50);
  const [dragging, setDragging] = useState(false);
  const [rendering, setRendering] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const origRef = useRef(null);
  const filtRef = useRef(null);
  const sliderWrapRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setSrcImg(img);
    img.onerror = () => setSrcImg(null);
    img.src = SAMPLE_PATH;
  }, []);

  const displayImg = userImg || srcImg;

  useEffect(() => {
    if (!displayImg) return;

    const width = displayImg.naturalWidth || displayImg.width;
    const height = displayImg.naturalHeight || displayImg.height;

    const originalCanvas = origRef.current;
    if (originalCanvas) {
      originalCanvas.width = width;
      originalCanvas.height = height;
      originalCanvas.getContext("2d").drawImage(displayImg, 0, 0, width, height);
    }

    setRendering(true);
    const timeout = window.setTimeout(() => {
      renderToCanvas(filtRef.current, displayImg, activeFilter, width, height);
      setRendering(false);
    }, 40);

    return () => window.clearTimeout(timeout);
  }, [displayImg, activeFilter]);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const img = new Image();
    img.onload = () => setUserImg(img);
    img.src = URL.createObjectURL(file);
  };

  const getSliderPct = (event) => {
    const wrap = sliderWrapRef.current;
    if (!wrap) return sliderPos;
    const rect = wrap.getBoundingClientRect();
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    return Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
  };

  const download = () => {
    const canvas = filtRef.current;
    if (!canvas) return;
    const anchor = document.createElement("a");
    anchor.download = `dreamlens-${activeFilter.id}.png`;
    anchor.href = canvas.toDataURL("image/png", 1);
    anchor.click();
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      background: "radial-gradient(circle at top left, rgba(127, 255, 193, 0.16), transparent 18%), radial-gradient(circle at bottom right, rgba(114, 194, 255, 0.12), transparent 16%), linear-gradient(180deg, #08120d 0%, #0b1a10 100%)",
      color: "#d8edd8",
      fontFamily: "system-ui, sans-serif",
      overflowX: "hidden",
    }}>
      <Header displayImg={displayImg} onExport={download} inputRef={inputRef} onUploadClick={() => inputRef.current?.click()} onFileSelect={handleFile} />

      <div style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }}>
        <FiltersSidebar filters={FILTERS} displayImg={displayImg} activeFilter={activeFilter} onFilterSelect={setActiveFilter} />

        <ImageCompare
          displayImg={displayImg}
          activeFilter={activeFilter}
          rendering={rendering}
          origRef={origRef}
          filtRef={filtRef}
          sliderWrapRef={sliderWrapRef}
          sliderPos={sliderPos}
          setSliderPos={setSliderPos}
          dragging={dragging}
          setDragging={setDragging}
          getSliderPct={getSliderPct}
          onReset={() => setUserImg(null)}
          onDownload={download}
          dragOver={dragOver}
          setDragOver={setDragOver}
          onFileSelect={handleFile}
          onUploadClick={() => inputRef.current?.click()}
        />

        <FontsSidebar fonts={FONTS} activeFont={activeFont} onFontSelect={setActiveFont} />
      </div>

      <Footer filters={FILTERS} activeFilter={activeFilter} onFilterSelect={setActiveFilter} />
    </div>
  );
}

function applyLUT(data, lut) {
  for (let i = 0; i < data.length; i += 4) {
    const lum = (data[i] * 0.2126 + data[i + 1] * 0.7152 + data[i + 2] * 0.0722) / 255;
    const sh = Math.pow(Math.max(0, 1 - lum * 2.5), 1.5);
    const hi = Math.pow(Math.max(0, lum * 2 - 1), 1.2);
    const mi = Math.max(0, 1 - sh - hi);

    data[i] = Math.min(255, Math.max(0, data[i] + lut.shadows[0] * sh + lut.mids[0] * mi + lut.highs[0] * hi));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + lut.shadows[1] * sh + lut.mids[1] * mi + lut.highs[1] * hi));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + lut.shadows[2] * sh + lut.mids[2] * mi + lut.highs[2] * hi));
  }
}

function applyGrain(data, strength) {
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 255 * strength;
    data[i] = Math.min(255, Math.max(0, data[i] + noise));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
  }
}

export function renderToCanvas(canvas, img, filter, W, H) {
  if (!canvas || !img) return;
  canvas.width = W;
  canvas.height = H;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  if (filter.id === "original") {
    ctx.drawImage(img, 0, 0, W, H);
    return;
  }

  ctx.filter = filter.cssFilter;
  ctx.drawImage(img, 0, 0, W, H);
  ctx.filter = "none";

  const imageData = ctx.getImageData(0, 0, W, H);
  if (filter.lut) applyLUT(imageData.data, filter.lut);
  if (filter.grain) applyGrain(imageData.data, filter.grain);
  ctx.putImageData(imageData, 0, 0);

  if (filter.bloomStrength > 0) {
    const bloomCanvas = document.createElement("canvas");
    bloomCanvas.width = W;
    bloomCanvas.height = H;
    const bloomCtx = bloomCanvas.getContext("2d");
    if (bloomCtx) {
      bloomCtx.filter = `blur(${filter.bloomRadius}px) brightness(1.3)`;
      bloomCtx.drawImage(canvas, 0, 0, W, H);
      bloomCtx.filter = "none";
      ctx.globalCompositeOperation = "screen";
      ctx.globalAlpha = filter.bloomStrength;
      ctx.drawImage(bloomCanvas, 0, 0);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    }
  }

  if (filter.vigStrength > 0) {
    const [vr, vg, vb] = filter.vigColor;
    const vignette = ctx.createRadialGradient(W / 2, H / 2, W * 0.18, W / 2, H / 2, W * 0.75);
    vignette.addColorStop(0, "rgba(0,0,0,0)");
    vignette.addColorStop(0.6, `rgba(${vr},${vg},${vb},0.1)`);
    vignette.addColorStop(1, `rgba(${vr},${vg},${vb},${filter.vigStrength})`);
    ctx.globalCompositeOperation = "multiply";
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = "source-over";
  }
}

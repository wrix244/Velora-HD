import os
import json
import math
from PIL import Image

VELORA_DIR = 'd:\\SaaS Tools\\Dream-Lens\\backend\\bulk-import\\VeloraHD'

def analyze_image(file_path):
    try:
        img = Image.open(file_path)
        img = img.convert('RGB')
        # Resize to a small size for fast analysis (e.g., 100x100 pixels)
        img = img.resize((100, 100))
        
        pixels = list(img.getdata())
        
        green_yellow_count = 0
        neon_purple_cyan_count = 0
        dark_count = 0
        low_sat_count = 0
        total_pixels = len(pixels)
        
        for r, g, b in pixels:
            # Convert RGB to HSV
            # r, g, b values are 0-255. Normalize to 0-1
            rf, gf, bf = r/255.0, g/255.0, b/255.0
            mx = max(rf, gf, bf)
            mn = min(rf, gf, bf)
            df = mx - mn
            
            # Hue calculation
            if df == 0:
                h = 0
            elif mx == rf:
                h = (60 * ((gf - bf) / df) + 360) % 360
            elif mx == gf:
                h = (60 * ((bf - rf) / df) + 120) % 360
            elif mx == bf:
                h = (60 * ((rf - gf) / df) + 240) % 360
                
            s = 0 if mx == 0 else (df / mx) * 100
            v = mx * 100
            
            # 1. Dark pixels (Space/Cosmic background, shadows)
            if v < 18:
                dark_count += 1
                continue
                
            # 2. Low Saturation (Minimalist, architecture grey/white)
            if s < 18:
                low_sat_count += 1
                continue
                
            # 3. Nature Hues (Green to Yellow-Green: Hue 35 to 140)
            if 35 <= h <= 145 and s > 20:
                green_yellow_count += 1
                
            # 4. Cyberpunk / Synthwave / Neon Hues (Purple, Magenta, Cyan, Pink, Violet: Hue 160 to 335)
            elif (160 <= h <= 340) and s > 25:
                neon_purple_cyan_count += 1

        p_dark = (dark_count / total_pixels) * 100
        p_low_sat = (low_sat_count / total_pixels) * 100
        p_nature = (green_yellow_count / total_pixels) * 100
        p_neon = (neon_purple_cyan_count / total_pixels) * 100
        
        # Heuristic classification
        category = 'Minimal'
        confidence = 0.5
        
        if p_low_sat > 50:
            category = 'Minimal'
            confidence = p_low_sat / 100
        elif p_nature > 25:
            category = 'Nature'
            confidence = p_nature / 100
        elif p_neon > 30:
            category = 'Cyberpunk'
            confidence = p_neon / 100
        elif p_dark > 65:
            if p_neon > 10:
                category = 'Cyberpunk'
            else:
                category = 'Space'
            confidence = p_dark / 100
        elif p_neon > 12 and p_dark > 40:
            category = 'Cyberpunk'
            confidence = (p_neon + p_dark) / 200
        elif p_nature > 10 and p_low_sat > 20:
            category = 'Nature'
            confidence = 0.6
        else:
            # Fallback to Abstract/Fantasy/Anime based on color richness
            if p_neon > p_nature:
                category = 'Abstract'
            else:
                category = 'Fantasy'
                
        return {
            'p_dark': round(p_dark, 1),
            'p_low_sat': round(p_low_sat, 1),
            'p_nature': round(p_nature, 1),
            'p_neon': round(p_neon, 1),
            'suggested_category': category,
            'confidence': round(confidence, 2)
        }
    except Exception as e:
        return {'error': str(e)}

def run_classification():
    if not os.path.exists(VELORA_DIR):
        print(f"Error: {VELORA_DIR} does not exist.")
        return
        
    files = os.listdir(VELORA_DIR)
    image_files = [f for f in files if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp'))]
    
    print(f"Analyzing {len(image_files)} image files...")
    
    results = {}
    for f in image_files:
        path = os.path.join(VELORA_DIR, f)
        stats = analyze_image(path)
        if 'error' not in stats:
            results[f] = stats

    output_path = 'd:\\SaaS Tools\\Dream-Lens\\backend\\scratch\\classification_results.json'
    with open(output_path, 'w') as out:
        json.dump(results, out, indent=2)
        
    print(f"Saved classification results for {len(results)} images to scratch/classification_results.json.")

if __name__ == '__main__':
    run_classification()

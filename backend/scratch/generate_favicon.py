import os
import re
import urllib.request
from PIL import Image, ImageDraw, ImageFont

def draw_gradient(width, height, start_color, end_color):
    base = Image.new("RGBA", (width, height))
    draw = ImageDraw.Draw(base)
    for y in range(height):
        for x in range(width):
            # Diagonal gradient from bottom-left to top-right
            t = (x + (height - y)) / (width + height)
            r = int(start_color[0] + (end_color[0] - start_color[0]) * t)
            g = int(start_color[1] + (end_color[1] - start_color[1]) * t)
            b = int(start_color[2] + (end_color[2] - start_color[2]) * t)
            draw.point((x, y), fill=(r, g, b, 255))
    return base

def main():
    width = 512
    height = 512
    
    # Exact website colors: from --color-primary (#FF2D6F) to --color-accent (#00E5FF)
    start_color = (255, 45, 111)
    end_color = (0, 229, 255)
    
    # Draw base gradient
    img = draw_gradient(width, height, start_color, end_color)
    
    # Create rounded corners mask (radius of 128px for 512px icon matches rounded-lg aspect)
    mask = Image.new("L", (width, height), 0)
    draw_mask = ImageDraw.Draw(mask)
    radius = 128
    draw_mask.rounded_rectangle([0, 0, width, height], radius, fill=255)
    
    # Apply mask
    rounded_img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    rounded_img.paste(img, (0, 0), mask=mask)
    
    # Download font dynamically
    font_path = "PermanentMarker.ttf"
    if not os.path.exists(font_path):
        print("Resolving font URL from Google Fonts API...")
        try:
            # Request CSS without User-Agent so Google returns the .ttf file format
            req = urllib.request.Request("https://fonts.googleapis.com/css2?family=Permanent+Marker")
            with urllib.request.urlopen(req) as response:
                css_content = response.read().decode('utf-8')
            
            # Find the url() links
            urls = re.findall(r'url\((https://[^\)]+\.ttf)\)', css_content)
            if not urls:
                # Fallback to woff2 if ttf is not found
                urls = re.findall(r'url\((https://[^\)]+)\)', css_content)
                font_path = "PermanentMarker.woff2"
                
            if urls:
                font_url = urls[0]
                print(f"Downloading font from resolved URL: {font_url}")
                urllib.request.urlretrieve(font_url, font_path)
            else:
                raise Exception("Could not find font URL in CSS response")
        except Exception as e:
            print(f"Failed to resolve font dynamically: {e}")
            # Absolute fallback to another google fonts source
            font_url = "https://github.com/wrix244/Velora-HD/raw/main/frontend/public/favicon.png" # not a font, just safety
            raise e
        
    # Load font and draw text
    font_size = 280
    font = ImageFont.truetype(font_path, font_size)
    
    draw = ImageDraw.Draw(rounded_img)
    text = "VH"
    
    # Centering math
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    x = (width - text_width) / 2 - bbox[0]
    y = (height - text_height) / 2 - bbox[1] - 25  # adjust slightly for baseline
    
    draw.text((x, y), text, fill=(255, 255, 255, 255), font=font)
    
    # Save the output to public/favicon.png and public/icon-512.png
    output_dir = os.path.join("..", "frontend", "public")
    os.makedirs(output_dir, exist_ok=True)
    
    favicon_path = os.path.join(output_dir, "favicon.png")
    rounded_img.save(favicon_path, "PNG")
    print(f"Success! Exact favicon logo generated and saved to {favicon_path}")
    
    icon512_path = os.path.join(output_dir, "icon-512.png")
    rounded_img.save(icon512_path, "PNG")
    print(f"Success! Exact icon-512 generated and saved to {icon512_path}")

if __name__ == "__main__":
    main()

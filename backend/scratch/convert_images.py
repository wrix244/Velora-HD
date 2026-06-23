import os
from PIL import Image

def convert_to_webp(png_path, webp_path, quality=85):
    if not os.path.exists(png_path):
        print(f"Skipping: {png_path} does not exist.")
        return False
    try:
        print(f"Converting {png_path} ({os.path.getsize(png_path) // 1024} KB)...")
        with Image.open(png_path) as img:
            img.save(webp_path, "WEBP", quality=quality, method=6)
        print(f"Saved to {webp_path} ({os.path.getsize(webp_path) // 1024} KB)")
        return True
    except Exception as e:
        print(f"Error converting {png_path}: {e}")
        return False

def main():
    # Paths relative to backend directory
    public_dir = os.path.join("..", "frontend", "public")
    
    # 1. Main background and hero images
    images_to_convert = [
        ("graffiti-hero.png", "graffiti-hero.webp"),
        ("space-hero.png", "space-hero.webp"),
        ("graffiti-bg.png", "graffiti-bg.webp"),
        ("space-bg.png", "space-bg.webp")
    ]
    
    for src, dest in images_to_convert:
        src_path = os.path.join(public_dir, src)
        dest_path = os.path.join(public_dir, dest)
        if convert_to_webp(src_path, dest_path, quality=82):
            # Safe delete the original PNG
            os.remove(src_path)
            print(f"Deleted original: {src_path}")
            
    # 2. Anime wallpapers (generate WebP previews, keep original PNGs for download)
    anime_dir = os.path.join(public_dir, "wallpapers", "anime")
    if os.path.exists(anime_dir):
        for filename in os.listdir(anime_dir):
            if filename.endswith(".png"):
                src_path = os.path.join(anime_dir, filename)
                dest_filename = filename[:-4] + ".webp"
                dest_path = os.path.join(anime_dir, dest_filename)
                
                # Keep high visual quality (quality=85) so previews look crisp and premium
                convert_to_webp(src_path, dest_path, quality=85)
                
                # If it's category-thumb.png (not a wallpaper download), we can safely delete it
                if filename == "category-thumb.png":
                    os.remove(src_path)
                    print(f"Deleted original category thumbnail: {src_path}")
                else:
                    print(f"Preserved original uncompressed wallpaper download: {src_path}")
                    
    print("\nImage optimization completed successfully!")

if __name__ == "__main__":
    main()

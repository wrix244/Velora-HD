package com.dreamlens.app;

import android.app.WallpaperManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Build;
import android.util.Base64;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "Wallpaper")
public class WallpaperPlugin extends Plugin {

    @PluginMethod
    public void setWallpaper(PluginCall call) {
        String base64Image = call.getString("base64");
        String location = call.getString("location", "both");

        if (base64Image == null) {
            call.reject("base64 image payload is required");
            return;
        }

        new Thread(() -> {
            try {
                // Strip metadata prefix if present (e.g. "data:image/png;base64,")
                String cleanBase64 = base64Image;
                if (base64Image.contains(",")) {
                    cleanBase64 = base64Image.split(",")[1];
                }

                byte[] decodedBytes = Base64.decode(cleanBase64, Base64.DEFAULT);
                Bitmap bitmap = BitmapFactory.decodeByteArray(decodedBytes, 0, decodedBytes.length);

                if (bitmap == null) {
                    call.reject("Failed to decode image from base64 string");
                    return;
                }

                WallpaperManager wallpaperManager = WallpaperManager.getInstance(getContext());

                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                    int flag;
                    if ("lock".equalsIgnoreCase(location)) {
                        flag = WallpaperManager.FLAG_LOCK;
                    } else if ("home".equalsIgnoreCase(location)) {
                        flag = WallpaperManager.FLAG_SYSTEM;
                    } else {
                        flag = WallpaperManager.FLAG_SYSTEM | WallpaperManager.FLAG_LOCK;
                    }
                    wallpaperManager.setBitmap(bitmap, null, true, flag);
                } else {
                    // Fallback for older Android APIs (sets both screen layers)
                    wallpaperManager.setBitmap(bitmap);
                }

                JSObject result = new JSObject();
                result.put("success", true);
                call.resolve(result);

            } catch (Exception e) {
                call.reject("Error setting wallpaper: " + e.getMessage(), e);
            }
        }).start();
    }
}

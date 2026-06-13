package com.velorahd.app;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Register native wallpaper bridge plugin
        registerPlugin(WallpaperPlugin.class);
    }
}

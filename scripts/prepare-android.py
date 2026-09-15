import os
import re
import sys
import subprocess

def setup_manifest():
    manifest_path = "android/app/src/main/AndroidManifest.xml"
    if not os.path.exists(manifest_path):
        print(f"Manifest not found at {manifest_path}")
        return

    with open(manifest_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Lock orientation to portrait (supports upside down as sensorPortrait)
    if "android:screenOrientation" not in content:
        content = content.replace(
            '<activity',
            '<activity\n            android:screenOrientation="sensorPortrait"'
        )
        print("Set android:screenOrientation=\"sensorPortrait\" in AndroidManifest.xml")

    with open(manifest_path, "w", encoding="utf-8") as f:
        f.write(content)

def setup_styles():
    styles_path = "android/app/src/main/res/values/styles.xml"
    if not os.path.exists(styles_path):
        print(f"styles.xml not found at {styles_path}")
        return

    with open(styles_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Enable fullscreen
    if "android:windowFullscreen" not in content:
        content = content.replace(
            '</style>',
            '    <item name="android:windowFullscreen">true</item>\n    </style>',
            1
        )
        print("Enabled fullscreen mode in styles.xml")

    with open(styles_path, "w", encoding="utf-8") as f:
        f.write(content)

def setup_icons():
    icon_src = "assets/icon.png"
    if not os.path.exists(icon_src):
        print("Source icon assets/icon.png not found")
        return

    densities = {
        "mipmap-mdpi": 48,
        "mipmap-hdpi": 72,
        "mipmap-xhdpi": 96,
        "mipmap-xxhdpi": 144,
        "mipmap-xxxhdpi": 192,
    }

    for folder, size in densities.items():
        dest_dir = os.path.join("android/app/src/main/res", folder)
        os.makedirs(dest_dir, exist_ok=True)
        for target in ["ic_launcher.png", "ic_launcher_round.png", "ic_launcher_foreground.png"]:
            dest_file = os.path.join(dest_dir, target)
            try:
                # Try ImageMagick
                res = subprocess.run(
                    ["magick", icon_src, "-resize", f"{size}x{size}", dest_file],
                    capture_output=True
                )
                if res.returncode != 0:
                    # Try legacy 'convert'
                    subprocess.run(
                        ["convert", icon_src, "-resize", f"{size}x{size}", dest_file],
                        check=True
                    )
            except Exception as e:
                # Fallback: copy file directly
                import shutil
                shutil.copyfile(icon_src, dest_file)
        print(f"Updated icons for {folder} ({size}x{size})")

if __name__ == "__main__":
    print("Preparing Android project settings...")
    setup_manifest()
    setup_styles()
    setup_icons()
    print("Android project configuration complete!")

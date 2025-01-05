import os
import shutil
import glob

# Create target directory if it doesn't exist
target_dir = "1_pony_furry"
os.makedirs(target_dir, exist_ok=True)

# Get all image files in current directory
image_extensions = ('.png', '.jpg', '.jpeg', '.gif', '.webp')
image_files = []
for ext in image_extensions:
    image_files.extend(glob.glob(f"*{ext}"))

for image_file in image_files:
    base_name = os.path.splitext(image_file)[0]
    
    # Check .wd and .tags files for "furry"
    has_furry = False
    for ext in ('.wd', '.tags'):
        tag_file = base_name + ext
        if os.path.exists(tag_file):
            with open(tag_file, 'r', encoding='utf-8') as f:
                content = f.read().lower()
                if 'furry' in content:
                    has_furry = True
                    break
    
    if has_furry:
        # Move the image file
        shutil.move(image_file, os.path.join(target_dir, image_file))
        
        # Move all associated files with same base name
        for file in os.listdir('.'):
            if file.startswith(base_name + '.'):
                try:
                    shutil.move(file, os.path.join(target_dir, file))
                except (shutil.Error, OSError) as e:
                    print(f"Error moving {file}: {e}")

print("Done! Files have been moved to the '1_pony_furry' directory.") 
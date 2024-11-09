import os
from PIL import Image

def split_image(image_path):
    image = Image.open(image_path)
    img_width, img_height = image.size

    rows, cols = 4, 6
    part_width = img_width // cols
    part_height = img_height // rows

    print(img_width)
    print(part_width)
    print(img_height)
    print(part_height)

    image_name = os.path.splitext(os.path.basename(image_path))[0]
    output_dir = os.path.join('split_images/', image_name)
    os.makedirs(output_dir, exist_ok=True)

    for row in range(rows):
        for col in range(cols):
            left = col * part_width
            upper = row * part_height
            right = left + part_width
            lower = upper + part_height

            part = image.crop((left, upper, right, lower))
            
            part_filename = f"{image_name}_part_{row}_{col}.png"
            part.save(os.path.join(output_dir, part_filename))
            
    print(f"Image split into {rows*cols} parts and saved in '{output_dir}'.")

def process_directory(directory_path):
    for filename in os.listdir(directory_path):
        file_path = os.path.join(directory_path, filename)

        if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp', '.gif', '.tiff')):
            print(f"Processing '{filename}'...")
            split_image(file_path)

process_directory("satellite_images")

from PIL import Image, ImageDraw, ImageFont
import os

def draw_grid(image_path, rows, cols, output_path):
    # Open the image
    image = Image.open(image_path)
    draw = ImageDraw.Draw(image)
    width, height = image.size

    # Calculate the size of each cell
    cell_width = width // cols
    cell_height = height // rows

    # Load a font
    try:
        font = ImageFont.truetype("arial.ttf", 20)
    except IOError:
        font = ImageFont.load_default()
    
    # Draw the grid and add text labels
    for row in range(rows):
        for col in range(cols):
            # Calculate the top-left corner of the cell
            top_left_x = col * cell_width
            top_left_y = row * cell_height

            # Calculate the bottom-right corner of the cell
            bottom_right_x = (col + 1) * cell_width
            bottom_right_y = (row + 1) * cell_height

            # Draw the rectangle outline for each cell
            draw.rectangle(
                [top_left_x, top_left_y, bottom_right_x, bottom_right_y],
                outline="black",
                width=2
            )

            # Add text (row, col) in the center of the cell
            text = f"{row},{col}"
            text_bbox = draw.textbbox((0, 0), text, font=font)
            text_width = text_bbox[2] - text_bbox[0]
            text_height = text_bbox[3] - text_bbox[1]
            text_x = top_left_x + (cell_width - text_width) / 2
            text_y = top_left_y + (cell_height - text_height) / 2
            draw.text((text_x, text_y), text, fill="black", font=font)
    
    # Save the image with the grid
    image.save(output_path)
    print(f"Grid image saved as {output_path}")

for filename in os.listdir("satellite_images"):
    if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp', '.gif', '.tiff')):
        file_path = os.path.join("satellite_images", filename)
        draw_grid(file_path, rows=4, cols=6, output_path=os.path.join("output", "grid" + filename))

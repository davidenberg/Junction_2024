import os
import shutil

if __name__ == "__main__":
    shutil.copytree("image_generation/satellite_images", "output", dirs_exist_ok=True)
    os.system("python3 draw_grid.py")

    os.chdir("image_generation")
    os.system("python3 split_images.py")

    os.chdir("../area_calculation")
    os.system("python3 segmentation.py")
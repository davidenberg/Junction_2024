import os
import shutil
import nbformat
from nbconvert.preprocessors import ExecutePreprocessor

if __name__ == "__main__":
    shutil.copytree("satellite_images", "output", dirs_exist_ok=True)
    os.system("python3 draw_grid.py")

    os.chdir("image_generation")
    os.system("python3 split_images.py")

    os.chdir("../image_classification")
    with open("image_classifier_validation.ipynb") as ff:
        nb_in = nbformat.read(ff, nbformat.NO_CONVERT)
        
    ep = ExecutePreprocessor(timeout=600, kernel_name='python3')

    nb_out = ep.preprocess(nb_in)

    os.chdir("../area_calculation")
    os.system("python3 segmentation.py")
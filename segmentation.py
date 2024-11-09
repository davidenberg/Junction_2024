import os
from skimage import io, filters, morphology, segmentation
from skimage.color import rgba2rgb, label2rgb
import matplotlib.pyplot as plt

def otsu_thresholding(image_name):
  # Load and blur the image to reduce noise
  image = io.imread("data/" + image_name, as_gray=True)

  # Apply Median filtering
  smoothed_image = filters.median(image, morphology.disk(5))  # Adjust disk size as needed

  threshold_value = filters.threshold_otsu(smoothed_image)
  binary_mask = smoothed_image > threshold_value

  # Display the result
  # plt.imshow(binary_mask, cmap='gray')
  # plt.title("Otsu's Thresholding")
  # plt.show()
  io.imsave("segmented/" + image_name, binary_mask)

def super_pixel(image_name):
  # Load the satellite image
  image = io.imread("data/" + image_name)

  image = rgba2rgb(image)

  # Apply SLIC segmentation
  segments_slic = segmentation.slic(image, n_segments=100, compactness=10, start_label=1)

  # Display the segmented image
  plt.imshow(label2rgb(segments_slic, image, kind='avg'))
  plt.title("SLIC Superpixel Segmentation")
  plt.show()

# super_pixel("2022-04.png")

# dir_list = os.listdir("data")
# for file in dir_list:
#   otsu_thresholding(file)
# otsu_thresholding("image.png")
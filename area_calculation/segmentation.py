import os
from skimage import io, filters, morphology, segmentation
from skimage.color import rgba2rgb, label2rgb
import matplotlib.pyplot as plt
import pandas as pd
from PIL import Image

def otsu_thresholding(image_name):
  # Load and blur the image to reduce noise
  image = io.imread(image_name, as_gray=True)

  # Apply Median filtering
  smoothed_image = filters.median(image, morphology.disk(5))  # Adjust disk size as needed

  threshold_value = filters.threshold_otsu(smoothed_image)
  binary_mask = smoothed_image > threshold_value

  # Display the result
  # plt.imshow(binary_mask, cmap='gray')
  # plt.title("Otsu's Thresholding")
  # plt.show()
  return binary_mask

def get_pixel_ratio(image_path):
  # Load the image and convert it to grayscale
  image = Image.open(image_path).convert("L")

  # Convert grayscale to binary image (black and white only)
  # Set a threshold value (e.g., 128), above which pixels are considered white
  threshold = 128
  binary_image = image.point(lambda p: p > threshold and 255)

  # Convert binary image to a list of pixel values
  pixels = list(binary_image.getdata())

  # Count white and black pixels
  white_pixels = pixels.count(255)
  black_pixels = pixels.count(0)

  # Calculate the ratio of white to black pixels
  if black_pixels == 0:
      # Avoid division by zero if there are no black pixels
      return float('inf')
  else:
      return white_pixels / black_pixels
      
  


# def super_pixel(image_name):
#   # Load the satellite image
#   image = io.imread(image_name)

#   image = rgba2rgb(image)

#   # Apply SLIC segmentation
#   segments_slic = segmentation.slic(image, n_segments=100, compactness=10, start_label=1)

#   # Display the segmented image
#   plt.imshow(label2rgb(segments_slic, image, kind='avg'))
#   plt.title("SLIC Superpixel Segmentation")
#   # plt.show()
  
if __name__ == "__main__":
  total_image_area_ha = 14807
  source_images_folder = "source_images/"
  output_folder = "output_images/"
  source_images = os.listdir(source_images_folder)
  
  deforestation_information_df = pd.DataFrame(columns=["image", "deforestation_area_ha"])
  for image in source_images:
    relative_image_path = source_images_folder + image
    output_image = otsu_thresholding(source_images_folder + image)
    
    # save for debugging
    io.imsave(output_folder + image, output_image)
    
    # get white/black ratio  
    pixel_ratio = get_pixel_ratio(output_folder + image)
    deforestation_area_ha = round(pixel_ratio * total_image_area_ha)
    
    data = {"image": image, "deforestation_area_ha": deforestation_area_ha}
    deforestation_information_df.loc[len(deforestation_information_df.index)] = data 
    print(deforestation_information_df)
    
    

# super_pixel("segmentation_test_image.png")

# dir_list = os.listdir("data")
# for file in dir_list:
#   otsu_thresholding(file)
# otsu_thresholding("image.png")
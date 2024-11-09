import os
from skimage import io, filters, morphology, segmentation
from skimage.color import rgba2rgb, label2rgb
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
from PIL import Image
from split_images import *
import json

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

def calculate_chunk_deforestation(image):
  total_image_area_ha = 14807
  
  deforestation_information_df = pd.DataFrame(columns=["image", "deforestation_area_ha"])
  output_folder = "../output/"
  output_image = otsu_thresholding(image)
  io.imsave(output_folder + "segmented_" + os.path.basename(image), output_image)
  
  # get white/black ratio  
  pixel_ratio = get_pixel_ratio(output_folder + "segmented_" + os.path.basename(image))

  deforestation_area_ha = round(pixel_ratio * total_image_area_ha)

  
  data = {"image": image, "deforestation_area_ha": deforestation_area_ha}
  deforestation_information_df.loc[len(deforestation_information_df.index)] = data 
  print(deforestation_area_ha)

  return deforestation_area_ha

def calculate_chunk_area(image_path):
    split_image(image_path)
    directory_path = "split_images/"
    image_name = os.path.splitext(os.path.basename(image_path))[0]
    listdir = os.listdir(directory_path + image_name)
    listdir.sort()
    arr = []
    for idx, filename in enumerate(listdir):
      file_path = os.path.join(directory_path + image_name, filename)
      if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp', '.gif', '.tiff')):
          arr.append(get_pixel_ratio(file_path))

    return np.array(arr)


if __name__ == "__main__":
  inputs = os.listdir("../satellite_images")
  images = []
  for filename in inputs:
      if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp', '.gif', '.tiff')):
          images.append(os.path.join("../satellite_images", filename))
  output_data_file = "../output/statistics.json"
  output_json = "../output/detections.json"

  df_0 = pd.read_pickle("../image_classification/deforestation_df_0.pkl")
  df_1 = pd.read_pickle("../image_classification/deforestation_df_1.pkl")
  df_2 = pd.read_pickle("../image_classification/deforestation_df_2.pkl")

  df_list = [df_0, df_1, df_2]



  #calculate are compared to previous area
  with open(output_data_file, 'w') as f:
    json_out = open(output_json, 'w')
    forest_coverage = []
    forest_coverage.append({"total_coverage" : str("14807")})
    forest_coverage.append({"type":"Polygon","coordinates":[[[-63.078518,-6.607827],[-63.213615,-6.607827],[-63.213615,-6.518797],[-63.078518,-6.518797],[-63.078518,-6.607827]]]})
    detection_data = []
    for idx, image in enumerate(images):
      if (df_list[idx]['label'] == 'not_deforestation').all():
        #images withouth deforestation cause a lot of noise, handle them separately here
        output_image = Image.new("RGB", (1086, 720), (0, 0, 0))
        output_image.save("../output/segmented_" + os.path.basename(image))
        data = {
           "date" : df_list[idx]['timestamp'].iloc[0],
           "coverage" : "100%"
        }
        forest_coverage.append(data)
        if idx == 0:
           df_list[idx]['prev_area'] = 0
           df_list[idx]['area'] = calculate_chunk_area("../output/segmented_" + os.path.basename(image))
        
      else:
        #there's at least some deforestation detected, see if it is new
        deforestation_area_ha = calculate_chunk_deforestation(image)
        df_list[idx]['prev_area'] = df_list[idx-1]['area']
        df_list[idx]['area'] = calculate_chunk_area("../output/segmented_" + os.path.basename(image))
        data = {
           "date" : df_list[idx]['timestamp'].iloc[0],
           "coverage" : str(100 - (deforestation_area_ha/14807 * 100)) + "%"
        }
        forest_coverage.append(data)
        for _, row in df_list[idx].iterrows():
           if (row['label'] == 'deforestation' and row['prev_label'] == 'not_deforestation'):
                print("Deforestation detected, label switch")
                print(f"Coordinates: ({row['x_coord']}, {row['y_coord']})")
                data = {
                   "date" : row['timestamp'],
                   "type" : "LS",
                   "x_cord" : str(row['x_coord']),
                   "y_cord" : str(row['y_coord'])
                }
                detection_data.append(data)
           if (abs(row['area']-row['prev_area']) > 0.05):
                print("Deforestation detected, increase in deforestation area")
                print(f"Coordinates: ({row['x_coord']}, {row['y_coord']}) ")
                data = {
                   "date" : row['timestamp'],
                   "type" : "DAI",
                   "x_cord" : str(row['x_coord']),
                   "y_cord" : str(row['y_coord']),
                   "area_change" : abs(row['area']-row['prev_area']) * 100
                }
                detection_data.append(data)
              #do something
    json.dump(forest_coverage, f)
    json.dump(detection_data, json_out)
  
    

# super_pixel("segmentation_test_image.png")

# dir_list = os.listdir("data")
# for file in dir_list:
#   otsu_thresholding(file)
# otsu_thresholding("image.png")
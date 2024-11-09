evalscript = """
//VERSION=3
function setup() {
  return {
    input: ["B02", "B03", "B04"],
    output: {
      bands: 3,
      sampleType: "AUTO", // default value - scales the output values from [0,1] to [0,255].
    },
  }
}

function evaluatePixel(sample) {
  return [2.5 * sample.B04, 2.5 * sample.B03, 2.5 * sample.B02]
}
"""

from oauthlib.oauth2 import BackendApplicationClient
from requests_oauthlib import OAuth2Session
from PIL import Image
import io

# Your client credentials
client_id = 'sh-2501e138-2a1d-4ece-8024-574d63122ee6'
client_secret = 'rSCyHMNPUQ2d8I1dVe1w8LvsudH6Kdsl'


# Create a session
client = BackendApplicationClient(client_id=client_id)
oauth = OAuth2Session(client=client)

# Get token for the session
token = oauth.fetch_token(token_url='https://identity.dataspace.copernicus.eu/auth/realms/CDSE/protocol/openid-connect/token',
                          client_secret=client_secret, include_client_id=True)

# All requests using this session will have an access token automatically added
resp = oauth.get("https://sh.dataspace.copernicus.eu/configuration/v1/wms/instances")
print(resp.content)

height = 0.1
width = 0.1
box_min_heighth = -61.3
box_min_width = -1.1

# bounding_boxes = [
#     [-61.3,-1.1,-61.2,-1.04],
#     # Add as many bounding boxes as needed to cover your area of interest
# ]

request = {
    "input": {
        "bounds": {
            "properties": {"crs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84"},
            "bbox": "",
        },
        "data": [
            {
                "type": "sentinel-2-l1c",
                "dataFilter": {
                    "timeRange": {
                        "from": "2023-09-01T00:00:00Z",
                        "to": "2023-10-31T00:00:00Z",
                    }
                },
            }
        ],
    },
    "output": {
        "width": 512,
        "height": 512,
    },
    "evalscript": evalscript,
}

def get_image(i, bbox):
    request["input"]["bounds"]["bbox"] = bbox
    url = "https://sh.dataspace.copernicus.eu/api/v1/process"
    response = oauth.post(url, json=request)
    data = response.content 
    print(data)

    # Create an in-memory binary stream to read byte data as an image
    image_stream = io.BytesIO(data)

    # Open the byte data as an image
    image = Image.open(image_stream)

    # Show or save the image
    image.save(f"images/training/negative/negative2_{i}.png")  

def bbox_area():
    START_LAT = -5.8
    END_LAT = -6.5
    START_LNG = -50.4
    END_LNG = -49
    JUMP_SIZE=0.01

    lat = START_LAT
    lng = START_LNG

    i = 0
    while lat > END_LAT:
        while lng < END_LNG:
            get_image(i, [lng, lat, lng + JUMP_SIZE, lat + JUMP_SIZE])
            i += 1
            lng += JUMP_SIZE
        lat -= JUMP_SIZE


bounding_boxes = [
    [-63,-6.6,-62.5,-6],
    # Add as many bounding boxes as needed to cover your area of interest
]

for i, bbox in enumerate(bounding_boxes):
    get_image(i, bbox)

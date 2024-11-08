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

bounding_boxes = [
    [-65.636787,-4.125966,-65.596275,-4.087079],
    [13.8221, 45.8508, 14.5596, 46.2919],
    [13.7, 45.8, 14.5, 46.2],  # Example of a different bbox
    # Add as many bounding boxes as needed to cover your area of interest
]

request = {
    "input": {
        "bounds": {
            "properties": {"crs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84"},
            "bbox": "",
        },
        "data": [
            {
                "type": "sentinel-2-l2c",
                "dataFilter": {
                    "timeRange": {
                        "from": "2024-10-01T00:00:00Z",
                        "to": "2024-10-31T00:00:00Z",
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



for i, bbox in enumerate(bounding_boxes):
    request["input"]["bounds"]["bbox"] = bbox
    url = "https://sh.dataspace.copernicus.eu/api/v1/process"
    response = oauth.post(url, json=request)
    data = response.content 

    # Create an in-memory binary stream to read byte data as an image
    image_stream = io.BytesIO(data)

    # Open the byte data as an image
    image = Image.open(image_stream)

    # Show or save the image
    image.save(f"images/training/negative/negative_{i}.png")  


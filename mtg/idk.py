from PIL import ImageFont
from PIL import ImageDraw
from PIL import Image
from git import Repo
import random
import requests
import json

# Opening JSON file
f = open('first 30.json')

# returns JSON object as
# a dictionary
data = json.load(f)

low = 0
high = len(data)
random = random.randint(0, len(data))
name = 'unknown'
i = 0
# Iterating through the json
# list
for d in data:

    if(i == random):
        print("!!! RandomNumber Was {0}!!".format(random))
        pic_url = d['image_uris']['art_crop']
        name = d['name']
        print(pic_url)

    print('{0}:{1}'.format(i, d['name']))
    i += 1


# Closing file
f.close()


with open('daily.jpg', 'wb') as handle:
    response = requests.get(pic_url, stream=True)

    if not response.ok:
        print(response)

    for block in response.iter_content(1024):
        if not block:
            break

        handle.write(block)


# Open an Image
img = Image.open('daily.jpg')
newsize = (600, 448)
img = img.resize(newsize)
# Call draw Method to add 2D graphics in an image
I1 = ImageDraw.Draw(img)

# Custom font style and font size
myFont = ImageFont.truetype('Goudy Mediaeval.ttf', 64)


# Add Text to an image
I1.text((10, 10), name, font=myFont, fill=(0, 0, 0))
I1.text((10-2, 10), name, font=myFont, fill=(255, 255, 255))
#newsize = (600, 448)
# Display edited image

img.show()

# Save the edited image
img.save("daily.jpg")


PATH_OF_GIT_REPO = r'../'
COMMIT_MESSAGE = 'comment from python script'


def git_push():
    try:
        repo = Repo(PATH_OF_GIT_REPO)
        repo.git.add(update=True)
        repo.git.add(r"mtg/daily.jpg")
        repo.index.commit(COMMIT_MESSAGE)
        origin = repo.remote(name='origin')
        origin.push()
    except Exception as e:
        print('Some error occured while pushing the code')
        print(e)


git_push()

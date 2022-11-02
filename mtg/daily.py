from PIL import ImageFont
from PIL import ImageDraw
from PIL import Image
from git import Repo
import random
import requests
import json
from random import randrange
import os
import schedule
import time
import datetime

def get_random_line(filepath: str) -> str:
    file_size = os.path.getsize(filepath)
    with open(filepath, 'rb') as f:
        while True:
            pos = random.randint(0, file_size)
            if not pos:  # the first line is chosen
                return f.readline().decode()  # return str
            f.seek(pos)  # seek to random position
            f.readline()  # skip possibly incomplete line
            line = f.readline()  # read next (full) line
            if line:
                return line.decode()
            # else: line is empty -> EOF -> try another position in next iteration


# Relies on a json file that is too big to upload to Github
def updateDailyImage():
    print(f"Updating image: {datetime.datetime.now()}")
    data = get_random_line("unique-artwork.json")
    data = data[:-2]
    d = json.loads(data)
    pic_url = d['image_uris']['art_crop']
    name = d['name']

    with open('daily.jpg', 'wb') as handle:
        response = requests.get(pic_url, stream=True)

        if not response.ok:
            print(response)

        for block in response.iter_content(1024):
            if not block:
                break
            handle.write(block)

        handle.close()

    print("Card Name={0}".format(name))
    print(f"Fetching Image from: {pic_url}")
    drawText(name)
    return


def drawText(name):
    # Closing file
    # Open an Image
    img = Image.open('daily.jpg')
    newsize = (600, 448)
    img = img.resize(newsize)

    # Call draw Method to add 2D graphics in an image
    I1 = ImageDraw.Draw(img)
    myFont = ImageFont.truetype('Goudy Mediaeval.ttf', 48)

    # Add Text to an image
    I1.text((10, 10), name, font=myFont, fill=(0, 0, 0))
    I1.text((10-2, 10-2), name, font=myFont, fill=(255, 255, 255))
    #newsize = (600, 448)
    # Display edited image

    # img.show()

    # Save the edited image
    img.save("daily.jpg")


def gitPush():
    PATH_OF_GIT_REPO = r'../'
    COMMIT_MESSAGE = 'commit of daily.jpg from daily.py'
    try:
        repo = Repo(PATH_OF_GIT_REPO)
        repo.git.add(update=True)
        repo.git.add(r"mtg/daily.jpg")
        repo.index.commit(COMMIT_MESSAGE)
        with repo.config_writer() as git_config:
            git_config.set_value('user', 'email', 'dylanberst@gmail.com')
            git_config.set_value('user', 'name', 'Dylan Robot Berst')
        origin = repo.remote(name='origin')
        origin.push()
        print('Successfully pushed to remote!')
    except Exception as e:
        print('Some error occured while pushing the code')
        print(e)


def updateAndPushDailyImage():
    updateDailyImage()
    gitPush()


#updateDailyImage()
#gitPush()
# schedule.every(10).seconds.do(updateDailyImage)
schedule.every().day.at("00:00").do(updateAndPushDailyImage)

while True:
    schedule.run_pending()
    time.sleep(3600*4) #4 hours

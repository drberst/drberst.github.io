# Dylan's Web Projects
Been working on web development skills lately, and the nice thing about web development is that I can share these coding projects online without people having to download or install anything. Most work on mobile too, but I haven't tested very much. Most are unfinished, but work well enough to take a look at.

## [/mtg](https://drberst.github.io/mtg)
Fetches a random MTG image using https://api.scryfall.com
- Also gets the flavor text of the card
- If it has no flavor text, then it gets the card name

### [/mtg/daily.jpg](https://drberst.github.io/mtg/daily.jpg)
I have an E-Ink picture frame that can display a jpg. So I needed an endpoint that was a raw jpg
- Works similar to the code fetching above, but also has a python script to save the image to a file and then push that file to this website. Also adds text in an old MtG font. (see [/mtg/idk.py](https://github.com/drberst/drberst.github.io/blob/main/mtg/idk.py))
- The image is called daily, but I didn't get that far. But all I would need to do is write code to run the python script when my computer starts, or run it every 24 hours on a raspberry pi server if I set one of those up in the future.


## [/audio](https://drberst.github.io/audio)
An older project that creates several diagrams from the audio of an mp3
- May or may not be able to use mic input
- Someday will make a way for a user to choose an mp3, or web link like youtube or spotify
- Also see /mic, might be the same thing, might be a newer or older version, will look into that at some point.



## [/music/tab-notation-and-sound](https://drberst.github.io/music/tab-notation-and-sound)
A newer project using Vexflow for musical notation and Tone.js for synthesizers that play the musical score / tablature. Also displays the audio waveform using another library. Should be a good base for other projects I'd like to do between guitar, piano, and code.
- Would like to be able to paste in ASCII tab or edit the tabs online somehow
- Or read tabs from a file, possibly midi, musicXML, or a simple text format of some kind

## [/music/notation](https://drberst.github.io/music/notation)
Just a nice looking example render provided in the Vexflow documentation. But in coding, in can be an achievement to get the screen to display anything at all. Hence most starting programs are just to print "Hello World". So this is my hello world for Vexflow.



## [/physics](https://drberst.github.io/physics)
I'd like to build a robot that hangs from the corners of a white board and can draw stuff on it. This is a simple physics simulation of how 2 motors could let the hanging bot reach anywhere on the board.

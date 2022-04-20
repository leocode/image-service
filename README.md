# Image Service

Acts as a wrapper for common image/video operations.

Supported video formats:
- mkv
- mp4

## Known issues
1. `pipe:0: Invalid data found when processing input. Cannot determine format of input stream 0:0 after EOF`

If we want to stream the file to `ffmpeg`, `ffmpeg` has to read the metadata of the file. For `.mp4` files metadata is stored at the end of file.
When the video is longer `ffmpeg` fails to read the metadata:
https://stackoverflow.com/questions/23002316/ffmpeg-pipe0-could-not-find-codec-parameters
Workaround: Use other video format like `mkv`.
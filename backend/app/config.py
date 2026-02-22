import os

class Config:
    DEBUG = True
    DOWNLOAD_FOLDER = os.path.join(os.getcwd(), "downloads")

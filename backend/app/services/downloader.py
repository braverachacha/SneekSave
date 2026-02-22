import subprocess
import os
import uuid
import json

DOWNLOAD_FOLDER = "downloads"

if not os.path.exists(DOWNLOAD_FOLDER):
    os.makedirs(DOWNLOAD_FOLDER)


def get_video_info(url):
    try:
        result = subprocess.run(
            ["yt-dlp", "--dump-single-json", url],
            capture_output=True,
            text=True,
            check=True
        )

        data = json.loads(result.stdout)

        formats = []
        for f in data.get("formats", []):
            if f.get("vcodec") != "none":  # video only
                formats.append({
                    "format_id": f.get("format_id"),
                    "ext": f.get("ext"),
                    "resolution": f.get("resolution"),
                    "filesize": f.get("filesize")
                })

        return {
            "success": True,
            "title": data.get("title"),
            "thumbnail": data.get("thumbnail"),
            "formats": formats[:15]  # limit to first 15
        }

    except subprocess.CalledProcessError as e:
        return {
            "success": False,
            "error": e.stderr
        }


def download_video(url, format_id=None):
    filename = str(uuid.uuid4())
    output_path = os.path.join(DOWNLOAD_FOLDER, f"{filename}.%(ext)s")

    command = [
        "yt-dlp",
        "-o", output_path
    ]

    if format_id:
        command.extend(["-f", format_id])

    command.append(url)

    try:
        subprocess.run(command, check=True)

        return {
            "success": True,
            "file": output_path
        }

    except subprocess.CalledProcessError as e:
        return {
            "success": False,
            "error": e.stderr
        }

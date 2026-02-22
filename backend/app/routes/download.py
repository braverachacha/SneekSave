from flask import Blueprint, request, jsonify
from app.services.downloader import download_video

download_bp = Blueprint("download", __name__)

@download_bp.route("/download", methods=["POST"])
def download():
    data = request.json
    url = data.get("url")
    format_id = data.get("format_id")

    if not url:
        return jsonify({"error": "URL required"}), 400

    result = download_video(url, format_id)

    if result["success"]:
        return jsonify(result)
    return jsonify(result), 500

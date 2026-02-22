from flask import Blueprint, request, jsonify
from app.services.downloader import get_video_info

info_bp = Blueprint("info", __name__)

@info_bp.route("/info", methods=["POST"])
def info():
    data = request.json
    url = data.get("url")

    if not url:
        return jsonify({"error": "URL required"}), 400

    result = get_video_info(url)

    if result["success"]:
        return jsonify(result)
    return jsonify(result), 500

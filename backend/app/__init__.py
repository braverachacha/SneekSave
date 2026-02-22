from flask import Flask
from flask_cors import CORS
from .config import Config


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app)

    # Register Blueprints
    from .routes.health import health_bp
    from .routes.download import download_bp
    from .routes.info import info_bp

    app.register_blueprint(health_bp, url_prefix="/api")
    app.register_blueprint(download_bp, url_prefix="/api")
    app.register_blueprint(info_bp, url_prefix="/api")

    return app

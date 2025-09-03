from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import os
from processor import extract_frames, ensure_dir

UPLOAD_DIR = "/data/uploads"
FRAMES_DIR = "/data/frames"

app = Flask(__name__)


@app.get("/health")
def health():
    return jsonify({"ok": True})


@app.post("/process")
def process_video():
    if "file" not in request.files:
        return jsonify({"error": "missing_file", "message": "No file provided"}), 400
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "empty_filename", "message": "Filename is empty"}), 400

    ensure_dir(UPLOAD_DIR)
    ensure_dir(FRAMES_DIR)

    fname = secure_filename(file.filename)
    path = os.path.join(UPLOAD_DIR, fname)
    try:
        file.save(path)
    except Exception:
        return jsonify({"error": "save_failed", "message": "Could not save upload"}), 500

    try:
        count, out_dir = extract_frames(path, FRAMES_DIR, fps=1)
    except ValueError as ve:
        return jsonify({"error": "cannot_open_video", "message": str(ve)}), 415
    except Exception as e:
        return jsonify({"error": "frame_extraction_failed", "message": str(e)}), 500

    return jsonify(
        {"message": "Processing complete", "frameCount": count, "framesDir": out_dir}
    )


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

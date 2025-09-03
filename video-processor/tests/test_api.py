import io
import os
import cv2
import numpy as np
import tempfile
from api import app


def _make_dummy_video(path: str, frames: int = 10, size=(64, 48), fps: int = 10):
    fourcc = cv2.VideoWriter_fourcc(*"MJPG")
    writer = cv2.VideoWriter(path, fourcc, fps, size)
    for i in range(frames):
        val = 255 if (i % 2 == 0) else 0
        frame = np.full((size[1], size[0], 3), val, dtype=np.uint8)
        writer.write(frame)
    writer.release()


def test_health_endpoint():
    client = app.test_client()
    res = client.get("/health")
    assert res.status_code == 200
    data = res.get_json()
    assert data.get("ok") is True


def test_process_missing_file():
    client = app.test_client()
    res = client.post("/process", data={})
    assert res.status_code == 400
    data = res.get_json()
    assert data.get("error") == "missing_file"


def test_process_success():
    client = app.test_client()
    with tempfile.TemporaryDirectory() as tmp:
        video_path = os.path.join(tmp, "sample.avi")
        _make_dummy_video(video_path)
        with open(video_path, "rb") as f:
            data = {"file": (io.BytesIO(f.read()), "sample.avi")}
            res = client.post(
                "/process", data=data, content_type="multipart/form-data"
            )
    assert res.status_code == 200
    body = res.get_json()
    assert isinstance(body.get("frameCount"), int) and body["frameCount"] > 0


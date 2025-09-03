import os
import sys
import tempfile
import cv2
import numpy as np

# Ensure module path includes project root (/app)
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
import processor  # noqa: E402


def _make_dummy_video(path: str, frames: int = 15, size=(64, 48), fps: int = 15):
    fourcc = cv2.VideoWriter_fourcc(*"MJPG")
    writer = cv2.VideoWriter(path, fourcc, fps, size)
    for i in range(frames):
        # alternating black/white frames
        val = 255 if (i % 2 == 0) else 0
        frame = np.full((size[1], size[0], 3), val, dtype=np.uint8)
        writer.write(frame)
    writer.release()


def test_extract_frames_basic():
    with tempfile.TemporaryDirectory() as tmp:
        video_path = os.path.join(tmp, "test.avi")
        frames_dir = os.path.join(tmp, "frames")
        _make_dummy_video(video_path)
        count, out_dir = processor.extract_frames(video_path, frames_dir, fps=1)
        assert count > 0
        assert os.path.isdir(out_dir)
        saved = [f for f in os.listdir(out_dir) if f.endswith(".jpg")]
        assert len(saved) == count

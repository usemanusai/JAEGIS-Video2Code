import os
import tempfile
import cv2
from video_processor import processor  # adjust import if needed


def _make_dummy_video(path: str, frames: int = 15, size=(64, 48), fps: int = 15):
    fourcc = cv2.VideoWriter_fourcc(*'MJPG')
    writer = cv2.VideoWriter(path, fourcc, fps, size)
    for i in range(frames):
        frame = (255 * (i % 2) * (cv2.UMat(48, 64, 0) == 0)).get()
        frame = cv2.cvtColor(frame, cv2.COLOR_GRAY2BGR)
        writer.write(frame)
    writer.release()


def test_extract_frames_basic():
    with tempfile.TemporaryDirectory() as tmp:
        video_path = os.path.join(tmp, 'test.avi')
        frames_dir = os.path.join(tmp, 'frames')
        _make_dummy_video(video_path)
        count, out_dir = processor.extract_frames(video_path, frames_dir, fps=1)
        assert count > 0
        assert os.path.isdir(out_dir)
        saved = [f for f in os.listdir(out_dir) if f.endswith('.jpg')]
        assert len(saved) == count


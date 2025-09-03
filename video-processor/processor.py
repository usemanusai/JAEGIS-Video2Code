import os
import cv2
from typing import Tuple


def ensure_dir(path: str) -> None:
    os.makedirs(path, exist_ok=True)


def extract_frames(video_path: str, out_dir: str, fps: int = 1) -> Tuple[int, str]:
    """
    Extract frames from video at a fixed rate (fps) and save as JPEGs.

    Returns (frame_count, out_dir)
    """
    ensure_dir(out_dir)

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise ValueError(f"Cannot open video: {video_path}")

    native_fps = cap.get(cv2.CAP_PROP_FPS) or 0
    if native_fps <= 0:
        native_fps = 30  # fallback

    interval = max(int(round(native_fps / fps)), 1)

    count = 0
    frame_idx = 0
    success, frame = cap.read()
    while success:
        if frame_idx % interval == 0:
            out_path = os.path.join(out_dir, f"frame_{count:04d}.jpg")
            cv2.imwrite(out_path, frame)
            count += 1
        frame_idx += 1
        success, frame = cap.read()

    cap.release()
    return count, out_dir


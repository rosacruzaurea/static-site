"""Extract public Elementor playlist metadata from a saved HTML file (stdlib only).

Usage: python3 tools/import-services.py /path/to/source.html
No network access, video download or third-party runtime dependency.
"""
from datetime import datetime, timezone
from hashlib import sha256
from html import unescape
from html.parser import HTMLParser
from pathlib import Path
import json
import re
import sys
from urllib.parse import urlparse, parse_qs


class Text(HTMLParser):
    def __init__(self):
        super().__init__()
        self.parts = []

    def handle_data(self, value):
        self.parts.append(value)


def plain(value):
    parser = Text()
    parser.feed(str(value or ""))
    return " ".join(unescape("".join(parser.parts)).split())


class Playlists(HTMLParser):
    def __init__(self):
        super().__init__()
        self.collections = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if attrs.get("data-widget_type") != "video-playlist.default":
            return
        settings = json.loads(attrs["data-settings"])
        title = plain(settings["playlist_title"])
        year = re.search(r"\b(20\d{2})\b", title)
        if not year:
            raise ValueError(f"Collection without a year: {title}")
        widget_id = attrs["data-id"]
        if not re.fullmatch(r"[a-zA-Z0-9-]+", widget_id):
            raise ValueError("Invalid widget ID")
        entries = []
        for item in settings["tabs"]:
            url = str(item.get("youtube_url", "")).strip()
            parsed = urlparse(url)
            short_url = parsed.netloc == "youtu.be"
            video_id = parsed.path.lstrip("/") if short_url else parse_qs(parsed.query).get("v", [""])[0]
            if (item.get("type") != "youtube" or parsed.scheme != "https"
                    or parsed.netloc not in ("www.youtube.com", "youtube.com", "youtu.be")
                    or (not short_url and parsed.path != "/watch")
                    or not re.fullmatch(r"[\w-]{11}", video_id)):
                raise ValueError(f"Unsupported video URL in {title}")
            name = plain(item["title"])
            duration = plain(item.get("duration", ""))
            if not name or (duration and not re.fullmatch(r"\d{1,3}:\d{2}(?::\d{2})?", duration)):
                raise ValueError(f"Invalid title/duration in {title}")
            entries.append({"title": name, "url": url, "duration": duration})
        self.collections.append({"id": "ciclo-" + widget_id, "title": title,
                                 "year": year[1], "entries": entries})


raw = Path(sys.argv[1]).read_bytes()
parser = Playlists()
parser.feed(raw.decode("utf-8"))
if not parser.collections:
    raise ValueError("No playlists found")
output = Path(__file__).resolve().parents[1] / "content/services.json"
output.write_text(json.dumps({
    "sourceUrl": "https://rosacruzaurea.org.br/biblioteca-de-servicos-e-conferencias/",
    "retrievedAt": datetime.now(timezone.utc).isoformat(),
    "sourceSha256": sha256(raw).hexdigest(),
    "collections": parser.collections,
}, ensure_ascii=False, indent=2) + "\n")
print(f"Imported {len(parser.collections)} collections and "
      f"{sum(len(c['entries']) for c in parser.collections)} entries.")

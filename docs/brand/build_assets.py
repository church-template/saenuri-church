# 새누리교회 로고 — 교회 명판의 예배당 아이콘을 사이트 대표색(네이비) 한 가지로 그린다.
# 한 좌표에서 SVG와 PNG를 같이 그리고, 사이트 로고·아이콘·og-image·전달용 묶음을 한 번에 만든다.
# og-image의 글자는 이미지 생성이 아니라 Pretendard 폰트로 넣는다(한글이 깨지지 않게).
# 실행: python3 docs/brand/build_assets.py  (레포 루트, Pillow + Pretendard 설치 필요)
import math
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[2]
BRAND = Path(__file__).parent
PUB, APP = ROOT / "client/public", ROOT / "client/src/app"
FONT = str(Path.home() / "Library/Fonts/Pretendard-{}.ttf")
NAVY, GRAY, MUTED, HAIR = "#13426f", "#5b616e", "#7c828a", "#dee1e6"  # NAVY = globals.css --color-primary
STROKE = 30

door = [(442, 860), (442, 733)] + [
    (511 + 69 * math.cos(math.radians(a)), 733 - 69 * math.sin(math.radians(a))) for a in range(180, -1, -6)
] + [(580, 733), (580, 860)]
PARTS = [
    [(512, 163), (512, 350)], [(440, 227), (583, 227)],  # 십자가
    [(283, 505), (512, 358), (740, 505)],  # 지붕
    [(352, 860), (352, 528), (512, 430), (668, 528), (668, 860)],  # 본당
    [(352, 668), (240, 695), (240, 860), (784, 860), (784, 695), (668, 668)],  # 날개·바닥
    door,
]

svg = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" fill="none" stroke="{NAVY}" '
       f'stroke-width="{STROKE}" stroke-linecap="round" stroke-linejoin="round">']
svg += [f'<polyline points="{" ".join(f"{x:.1f},{y:.1f}" for x, y in pts)}"/>' for pts in PARTS]
(BRAND / "saenuri-logo-mark.svg").write_text("\n".join(svg + ["</svg>"]) + "\n")

SS = 4  # 4배로 그린 뒤 줄여 가장자리를 매끄럽게
big = Image.new("RGBA", (1024 * SS, 1024 * SS))
d = ImageDraw.Draw(big)
r = STROKE * SS / 2
for pts in PARTS:
    sp = [(x * SS, y * SS) for x, y in pts]
    d.line(sp, fill=NAVY, width=STROKE * SS, joint="curve")
    for x, y in (sp[0], sp[-1]):  # 둥근 끝
        d.ellipse((x - r, y - r, x + r, y + r), fill=NAVY)
src = big.resize((1024, 1024), Image.LANCZOS)
src.save(BRAND / "saenuri-logo-mark.png")
mark = src.crop(src.getchannel("A").getbbox())  # 투명 여백을 잘라 아이콘만


def square(size, fill_ratio, bg=None):
    """아이콘이 정사각 캔버스의 fill_ratio만큼 차지하도록 가운데 놓는다."""
    canvas = Image.new("RGBA", (size, size), bg or (0, 0, 0, 0))
    scale = size * fill_ratio / max(mark.size)
    m = mark.resize((round(mark.width * scale), round(mark.height * scale)), Image.LANCZOS)
    canvas.alpha_composite(m, ((size - m.width) // 2, (size - m.height) // 2))
    return canvas


square(512, 0.86).save(PUB / "onlyLogo.png")  # 투명 — 헤더·소개 히어로
for size, path in [(192, PUB / "icon-192.png"), (512, PUB / "icon-512.png"), (180, APP / "apple-icon.png")]:
    square(size, 0.74, "white").convert("RGB").save(path)
square(512, 0.56, "white").convert("RGB").save(PUB / "icon-maskable-512.png")  # 마스크 안전 영역(지름 80%) 안
square(256, 0.9).save(APP / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])

# og-image 1200×630 — 아이콘 좌, 교회명·대표문구·교단 우
W, H = 1200, 630
og = Image.new("RGB", (W, H), "white")
m = mark.resize((round(mark.width * 300 / mark.height), 300), Image.LANCZOS)
og.paste(m, (130, (H - 300) // 2), m)
d = ImageDraw.Draw(og)
x = 470
d.text((x, 168), "새누리교회", font=ImageFont.truetype(FONT.format("Bold"), 112), fill=NAVY)
d.text((x, 318), "하나님이 기뻐하시는 사람을 세우는 교회", font=ImageFont.truetype(FONT.format("Regular"), 36), fill=GRAY)
d.line((x, 392, x + 560, 392), fill=HAIR, width=2)
d.text((x, 414), "기독교한국침례회  ·  Saenuri Baptist Church", font=ImageFont.truetype(FONT.format("SemiBold"), 26), fill=MUTED)
og.save(PUB / "og-image.jpg", quality=92)

# 교회 전달용 묶음(outputs/church-logo + zip) — 사이트에 넣은 파일과 같은 것을 모은다
import shutil, zipfile
OUT = ROOT / "outputs/church-logo"
square(1024, 0.86).save(OUT / "logo-1024.png")
shutil.copy(PUB / "onlyLogo.png", OUT / "logo-512.png")
shutil.copy(Path(__file__).with_name("saenuri-logo-mark.svg"), OUT / "logo.svg")
for name in ["icon-192.png", "icon-512.png", "icon-maskable-512.png", "og-image.jpg"]:
    shutil.copy(PUB / name, OUT / name)
for name in ["apple-icon.png", "favicon.ico"]:
    shutil.copy(APP / name, OUT / name)
with zipfile.ZipFile(ROOT / "outputs/church-logo.zip", "w", zipfile.ZIP_DEFLATED) as z:
    for f in sorted(OUT.iterdir()):
        z.write(f, f"church-logo/{f.name}")

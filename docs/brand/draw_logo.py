# 다섯 미션팀 조각이 집을 이루고, 가운데 비운 자리가 십자가가 되는 로고. SVG와 PNG를 같은 좌표로 만든다.
import sys
from PIL import Image, ImageDraw
out = sys.argv[1]
R = 14  # 모서리 둥글림(stroke 폭). 형태가 R/2씩 커지므로 틈은 그만큼 넓게 잡는다.
cx = 512
g = 20 + R          # 가는 틈(조각 사이)
arm = 104           # 십자가 팔 굵기
peak = (cx, 140)
left_eave, wall_l, wall_b = 150, 196, 780
cross_top, h_top, h_l = 250, 420, 300  # 세로 팔 시작, 가로 팔 위, 가로 팔 왼끝
h_bot = h_top + arm
eave = h_top + arm / 2 - g / 2  # 처마 틈을 가로 팔 한가운데에 맞춰 계단이 안 생기게
v_l = cx - arm / 2
def roof_y(x):  # 왼쪽 지붕선 위 x에서의 y
    return peak[1] + (cx - x) * (eave - peak[1]) / (cx - left_eave)
gx = cx - g / 2
tl = [(gx, roof_y(gx)), (gx, cross_top), (v_l, cross_top), (v_l, h_top), (h_l, h_top),
      (h_l, eave), (left_eave, eave)]
wall_t = eave + g
bl = [(wall_l, wall_t), (h_l, wall_t), (h_l, h_bot), (v_l, h_bot), (v_l, wall_b), (wall_l, wall_b)]
base_t = wall_b + g
base = [(wall_l, base_t), (1024 - wall_l, base_t), (1024 - wall_l, base_t + 64), (wall_l, base_t + 64)]
mirror = lambda pts: [(1024 - x, y) for x, y in reversed(pts)]
# 색: 바닥=그린(기도와 섬김으로 교회와 가정을 세우는 여선교회). 나머지 넷은 모두 십자가에 맞닿는다.
# 흰 바탕(집 실루엣) — 십자가·틈을 흰색으로 채워 사진·어두운 배경 위에서도 십자가가 또렷하게.
underlay = [(left_eave, eave), peak, (1024 - left_eave, eave), (1024 - wall_l, eave),
            (1024 - wall_l, base_t + 64), (wall_l, base_t + 64), (wall_l, eave)]
pieces = [(underlay, "#ffffff"), (tl,"#3aa0dc"), (mirror(tl), "#e8801c"), (bl, "#2563c9"), (mirror(bl), "#cf3b2b"), (base, "#2f8f52")]
fmt = lambda pts: " ".join(f"{x:.1f},{y:.1f}" for x, y in pts)
svg = ['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">']
svg += [f'<polygon points="{fmt(p)}" fill="{c}" stroke="{c}" stroke-width="{R}" stroke-linejoin="round"/>' for p, c in pieces]
svg.append("</svg>")
open(f"{out}/saenuri-logo-5team.svg", "w").write("\n".join(svg))
S = 4
im = Image.new("RGBA", (1024 * S, 1024 * S))
d = ImageDraw.Draw(im)
for p, c in pieces:
    sp = [(x * S, y * S) for x, y in p]
    d.polygon(sp, fill=c)
    d.line(sp + [sp[0]], fill=c, width=R * S, joint="curve")
    for x, y in sp:  # 꼭짓점 둥글게
        d.ellipse((x - R * S / 2, y - R * S / 2, x + R * S / 2, y + R * S / 2), fill=c)
im = im.resize((1024, 1024), Image.LANCZOS)
im.save(f"{out}/saenuri-logo-5team.png")
cell = 420
b = Image.new("RGB", (cell, cell + 70), "white")
big, s = im.resize((cell, cell), Image.LANCZOS), im.resize((40, 40), Image.LANCZOS)
b.paste(big, (0, 0), big); b.paste(s, (20, cell + 15), s)
b.save(f"{out}/board-5team.png")

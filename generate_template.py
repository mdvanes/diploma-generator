from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

pdfmetrics.registerFont(TTFont("Diploma", "assets/Diploma.ttf"))

W, H = 1190.55, 841.89

DARK = (0.101961, 0.101961, 0.101961)
BLUE = (0.05882,  0.40784,  0.65098)   # #0f68a6  -- anniversary
RED  = (0.75294,  0.00392,  0.00000)   # #c00100  -- honorary degree


def draw_mixed_centered(c, cx, y, parts, font, size):
    total_w = sum(pdfmetrics.stringWidth(t, font, size) for t, _ in parts)
    x = cx - total_w / 2
    c.setFont(font, size)
    for text, color in parts:
        c.setFillColorRGB(*color)
        c.drawString(x, y, text)
        x += pdfmetrics.stringWidth(text, font, size)


def generate(accent, output_path):
    c = canvas.Canvas(output_path, pagesize=(W, H))

    # Background only -- borders are drawn dynamically by pdf-lib when enabled
    c.setFillColorRGB(0.992157, 0.988235, 0.972549)
    c.rect(0, 0, W, H, fill=1, stroke=0)

    # "The colleagues of Codestar hereby celebrate"
    draw_mixed_centered(c, W/2, 696, [
        ("The colleagues of ",       DARK),
        ("C",                        accent),
        ("odestar hereby celebrate", DARK),
    ], "Diploma", 36)

    # "presented at Codestar HQ, Nieuwegein"
    draw_mixed_centered(c, W/2, 433, [
        ("presented at ",            DARK),
        ("C",                        accent),
        ("odestar HQ, Nieuwegein",   DARK),
    ], "Diploma", 36)

    # "Rector Magnificus" -- R accented, centred at X=943, y=250
    draw_mixed_centered(c, 943, 250, [
        ("R",                accent),
        ("ector Magnificus", DARK),
    ], "Diploma", 16)

    c.save()
    print(f"Done: {output_path}")


generate(BLUE, "assets/template.pdf")
generate(RED,  "assets/template_honorary.pdf")

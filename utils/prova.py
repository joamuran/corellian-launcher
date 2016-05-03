import cairo
import rsvg

img = cairo.ImageSurface(cairo.FORMAT_ARGB32,256,256)

ctx = cairo.Context(img)
ctx.scale(256,256)

handle = rsvg.Handle("/usr/share/icons/Numix-Circle/scalable/apps/abrowser.svg")
# or, for in memory SVG data:
#handle= rsvg.Handle(None, str(<svg data>))

handle.render_cairo(ctx)

img.write_to_png("svg.png")

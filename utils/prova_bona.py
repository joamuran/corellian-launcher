import rsvg
import cairo
import StringIO

def render_svg_to_png(svg_data):
    # Render
    svg = rsvg.Handle(data=svg_data)
    img = cairo.ImageSurface(cairo.FORMAT_ARGB32, 
      256, 
      256)
    ctx = cairo.Context(img)
    
    scaleX = float(256) / float(svg.props.width)
    scaleY = float(256) / float(svg.props.height)
    ctx.save()
    ctx.scale(scaleX, scaleY)

    svg.render_cairo(ctx)

    # Write to StringIO
    png_io = StringIO.StringIO()
    img.write_to_png(png_io)

    return png_io.getvalue()


#def svg2png(svgfile, outfile, )

svg_data = open('/usr/share/icons/Numix-Circle/scalable/apps/abrowser.svg', 'r').read()
img=render_svg_to_png(svg_data)
#img.write_to_png("test.png");
with open("prova_.png", "wb") as out:
    out.write(img)


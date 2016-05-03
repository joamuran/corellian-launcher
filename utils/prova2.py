from wand.api import library
import wand.color
import wand.image

with wand.image.Image() as image:
    with wand.color.Color('transparent') as background_color:
        library.MagickSetBackgroundColor(image.wand, 
                                         background_color.resource) 

#with open('/usr/share/icons/Numix-Circle/scalable/apps/abrowser.svg') as f:
#    image = f.read()


    image.read(filename="/usr/share/icons/Numix-Circle/scalable/apps/abrowser.svg", width=256, height=256)
    #image.resize(256, 256)
    png_image = image.make_blob("png32")
    

with open("prova2.png", "wb") as out:
    out.write(png_image)


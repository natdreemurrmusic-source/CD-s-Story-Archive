Image manifest helper

To regenerate /images/images.json from the files in `/images` run:

```bash
npm run generate-images-manifest
```

This script will include common raster image types (.png, .jpg, .jpeg, .gif, .webp, .bmp) and exclude `.ico` files.

The background rotator on `index.html` will use `/images/images.json`. If it cannot load the manifest it will fall back to `Nat Gained Some LOVE.gif`.

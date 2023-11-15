# mapproxy-seed
<img src="https://www.greenvelvet.com/wp-content/uploads/2020/11/Untitled-design-2.png" width="250"/>

This is a simple CLI for interacting with Mapproxy-Seed utility.

For more detailed help please  use the `help` command in the CLI.
```bash
mapproxy-seed-cli --help
```

## Docker

It is recommended to use docker to run the cli.
To build the docker image run the following command

```bash
  docker build -t mapproxy-seed-cli .
```

## Usage

### seed cache by requested args
```bash
mapproxy-seed-cli seed --cache Bluemable-cache --grid WorldCRS84 --from-zoom 0 --to-zoom 5 --refresh-before 2023-11-07T12:35:00 --skip-uncached false --concurrency 5 --geojson-file /path/to/geojson.txt
```

```bash
Command: `seed` [options]

  Options:

          --cache              [string] [required]     name of the requested mapproxy cached layer
    -g,   --grid               [string] [required]     name of the requested grid
          --from-zoom          [number] [required]     seed starts from this zoom level
    -s,   --to-zoom            [number] [required]     seed ends at this zoom level
    --rb, --refresh-before     [string] [required]     refresh tile before this, supported format "yyyy-MM-ddTHH:mm:ss"
    -s,   --skip-uncached      [boolean][required]     skip uncached tiles, seeds or refresh only cached tiles, default to "true" if value is not given
          --geojson-file       [string] [required]     geojson txt file path
    -c,   --concurrency        [number] [required]     number of concurrent seed worker
    -h,   --help                                       output usage information
    -V,   --version                                    output the version number
```


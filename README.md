# Piping Data Improving and Performance

Example project to unsderstand how to use streams to improve the performance. This project is part of a presentation for the [DevFest 2022](https://gdg.community.dev/events/details/google-gdg-cali-presents-devfest-cali-2022/) organized by [GDG Cali](https://gdg.community.dev/gdg-cali/)

## How to use it

### Install
```bash
# Install dependencies
npm i
```


### Create input file from seed
_Seed -> Ids -> Input_

```bash
# Create a recipe files of 1GB
npm run seed -- 1

# Create a recipe files of 0.2GB (~200MB)
npm run seed -- 0.2
```


### Process seed file
```bash
# Process file using the buffer solution
npm run start -- buffer

# Process file using the stream solution
npm run start -- stream
```


## Copyright
- Example data downloaded from [Datakick](https://gtinsearch.org/)

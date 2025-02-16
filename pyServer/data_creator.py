from Webscrapper import scrapper
import json

all_parks_simple = [
    'Banff National Park', 'Jasper National Park', 'Yoho National Park', 'Kootenay National Park', 
    'Waterton Lakes National Park', 'Mount Revelstoke National Park', 'Glacier National Park', 
    'Riding Mountain National Park', 'Glenbow Ranch Provincial Park', 'Bow Valley Provincial Park', 
    'Yellowstone National Park', 'Yosemite National Park', 'Grand Canyon National Park', 
    'Great Smoky Mountains National Park', 'Zion National Park', 'Glacier National Park', 
    'Rocky Mountain National Park', 'Acadia National Park', 'Bryce Canyon National Park', 
    'Arches National Park', 'Kruger National Park', 'Serengeti National Park', 'Amazon Rainforest National Park', 
    'Chobe National Park', 'Galápagos Islands National Park', 'Komodo National Park', 'Fiordland National Park', 
    'Torres del Paine National Park', 'Banff National Park', 'Great Barrier Reef Marine Park', 
    'Iguaçu National Park', 'Victoria Falls National Park', 'Denali National Park', 'Sundarbans National Park', 
    'Etosha National Park', 'Saguaro National Park', 'Yellowstone National Park', 'Mount Kenya National Park', 
    'Masai Mara National Reserve', 'Tadoba Andhari Tiger Reserve'
]

results = []
counter = 0
for park in all_parks_simple:
    result = scrapper.get_location_info(park, 0)
    results.append(result)
    counter += 1
    print(f"Finished with {counter} out of {len(all_parks_simple)}")


with open('parks_results.json', 'w') as json_file:
    json.dump(results, json_file, indent=4)


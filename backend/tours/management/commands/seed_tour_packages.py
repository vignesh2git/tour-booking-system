"""Seed 50+ additional tour packages (safe to run multiple times — skips duplicate titles)."""

from decimal import Decimal

from django.core.management.base import BaseCommand

from tours.models import TourPackage

# 55 diverse packages: title, description snippet, location, price (USD), duration
RAW = [
    ("Santorini Caldera Views", "Sunsets over the Aegean, cliff-side dining, and iconic blue domes.", "Santorini, Greece", 2199, "5 days / 4 nights"),
    ("Kyoto Temple Trail", "Ancient shrines, bamboo groves, and tea-house traditions.", "Kyoto, Japan", 2899, "6 days / 5 nights"),
    ("Banff Alpine Peaks", "Turquoise lakes, wildlife, and Rocky Mountain vistas.", "Banff, Canada", 1799, "5 days / 4 nights"),
    ("Marrakech Medina Magic", "Souks, riads, and desert excursions at the Atlas foothills.", "Marrakech, Morocco", 1499, "4 days / 3 nights"),
    ("Amalfi Coast Drive", "Cliffside villages, limoncello, and Mediterranean charm.", "Amalfi, Italy", 2499, "6 days / 5 nights"),
    ("Reykjavik Northern Lights", "Geysers, glaciers, and aurora hunting under Arctic skies.", "Reykjavik, Iceland", 3299, "5 days / 4 nights"),
    ("Bali Rice Terrace Retreat", "Spa rituals, surf beaches, and emerald terraces.", "Ubud, Bali", 1299, "7 days / 6 nights"),
    ("Lisbon Tram & Tiles", "Fado nights, pastel de nata, and Atlantic breezes.", "Lisbon, Portugal", 1199, "5 days / 4 nights"),
    ("Cape Town Winelands", "Table Mountain, vineyards, and penguin beaches.", "Cape Town, South Africa", 1899, "6 days / 5 nights"),
    ("Petra & Wadi Rum", "Rose-red city and Bedouin camps under the stars.", "Jordan", 1899, "5 days / 4 nights"),
    ("Hanoi Street Food & Halong", "Pho and bánh mì, then a limestone bay cruise.", "Vietnam", 1099, "6 days / 5 nights"),
    ("Swiss Alps Rail Journey", "Panoramic trains, alpine villages, and fondue.", "Interlaken, Switzerland", 2699, "6 days / 5 nights"),
    ("Scottish Highlands Road", "Lochs, castles, and whisky trails.", "Inverness, Scotland", 1599, "5 days / 4 nights"),
    ("Singapore Skyline & Gardens", "Futuristic city, hawker feasts, and Marina Bay.", "Singapore", 1399, "4 days / 3 nights"),
    ("Queenstown Adventure", "Bungee, jet boats, and Milford Sound day trips.", "Queenstown, New Zealand", 2099, "6 days / 5 nights"),
    ("Dubai Desert & Towers", "Skyline luxury, dunes, and souk shopping.", "Dubai, UAE", 1699, "4 days / 3 nights"),
    ("Seville Flamenco Nights", "Moorish palaces, tapas, and orange-scented plazas.", "Seville, Spain", 1299, "5 days / 4 nights"),
    ("Zanzibar Spice & Beach", "Stone Town history and powder-white shores.", "Zanzibar, Tanzania", 2199, "6 days / 5 nights"),
    ("Havana Classic Cars", "Colonial streets, salsa, and Caribbean color.", "Havana, Cuba", 1599, "5 days / 4 nights"),
    ("Machu Picchu Trek Lite", "Cusco markets, Sacred Valley, and cloud citadel.", "Peru", 2499, "7 days / 6 nights"),
    ("Paris Art & Seine", "Museums, cafés, and river sunsets.", "Paris, France", 2299, "5 days / 4 nights"),
    ("Vienna Imperial Palaces", "Coffee houses, opera, and Habsburg grandeur.", "Vienna, Austria", 1699, "4 days / 3 nights"),
    ("Cairo Pyramids & Nile", "Ancient wonders and felucca breezes.", "Cairo, Egypt", 1399, "5 days / 4 nights"),
    ("Helsinki Design & Sauna", "Nordic minimalism, archipelago, and Baltic light.", "Helsinki, Finland", 1499, "4 days / 3 nights"),
    ("Buenos Aires Tango", "Steak houses, milongas, and La Boca colors.", "Buenos Aires, Argentina", 1299, "5 days / 4 nights"),
    ("Taipei Night Markets", "Temples, dumplings, and mountain day trips.", "Taipei, Taiwan", 999, "5 days / 4 nights"),
    ("Oslo Fjords & Museums", "Viking ships, Nordic design, and scenic cruises.", "Oslo, Norway", 1899, "5 days / 4 nights"),
    ("Prague Castle & Bridges", "Gothic spires, beer halls, and cobblestone charm.", "Prague, Czech Republic", 1199, "4 days / 3 nights"),
    ("Antigua Colonial & Volcanoes", "Colorful towns, coffee farms, and lake views.", " Guatemala", 1099, "5 days / 4 nights"),
    ("Edinburgh Festival City", "Castle rock, ghost tours, and whisky tastings.", "Edinburgh, Scotland", 1399, "4 days / 3 nights"),
    ("Muscat Desert & Coast", "Forts, wadis, and dhow cruises on the Gulf.", "Muscat, Oman", 1799, "5 days / 4 nights"),
    ("Krakow Old Town & Salt", "Medieval squares and underground chapels.", "Krakow, Poland", 999, "4 days / 3 nights"),
    ("Auckland & Rotorua", "Harbor city, geothermal parks, and Māori culture.", "New Zealand", 1699, "6 days / 5 nights"),
    ("Bruges Canals & Chocolate", "Medieval lanes, belfries, and pralines.", "Bruges, Belgium", 1199, "3 days / 2 nights"),
    ("Colombo Tea & Coast", "Coconut groves, spice gardens, and Indian Ocean.", "Sri Lanka", 1199, "6 days / 5 nights"),
    ("Mexico City Art & Cuisine", "Frida’s legacy, tacos, and Aztec roots.", "Mexico City, Mexico", 1099, "5 days / 4 nights"),
    ("Montreal French Flair", "Old port, bagels, and festivals year-round.", "Montreal, Canada", 1099, "4 days / 3 nights"),
    ("Split Adriatic Gateway", "Diocletian’s palace, islands, and seafood.", "Split, Croatia", 1399, "5 days / 4 nights"),
    ("Hobart Wilderness & Food", "MONA, markets, and Tasmanian trails.", "Hobart, Australia", 1499, "5 days / 4 nights"),
    ("Riga Art Nouveau", "Baltic history, markets, and seaside Jūrmala.", "Riga, Latvia", 899, "4 days / 3 nights"),
    ("Casablanca & Chefchaouen", "Atlantic breeze and the blue pearl of the Rif.", "Morocco", 1599, "6 days / 5 nights"),
    ("San Diego Coast & Zoo", "Pacific beaches, Balboa Park, and craft beer.", "San Diego, USA", 1299, "7 days / 6 nights"),
    ("Chiang Mai Temples & Hills", "Elephant sanctuaries, night bazaars, and cooking classes.", "Chiang Mai, Thailand", 899, "5 days / 4 nights"),
    ("Valletta Fortress Islands", "Knights’ history, azure coves, and pastizzi.", "Malta", 1199, "5 days / 4 nights"),
    ("Quito & Galápagos Preview", "Equatorial capital and cloud forest gateway.", "Ecuador", 1999, "6 days / 5 nights"),
    ("Warsaw & Mazovia", "Rebuilt old town, pierogi, and Polish resilience.", "Warsaw, Poland", 999, "4 days / 3 nights"),
    ("Manila Islands Hop", "Historic Intramuros and Palawan-style escapes.", "Philippines", 999, "6 days / 5 nights"),
    ("Tallinn Medieval Walls", "Cobblestone tech hub, saunas, and Baltic sea.", "Tallinn, Estonia", 1099, "4 days / 3 nights"),
    ("Johannesburg & Safari", "Urban energy, Apartheid Museum, and Big Five reserves.", "South Africa", 2299, "6 days / 5 nights"),
    ("Salt Lake City Peaks", "National parks, red rock, and mountain air.", "Utah, USA", 1399, "4 days / 3 nights"),
    ("Nairobi & Great Rift", "Giraffe center, Karen Blixen, and escarpment views.", "Kenya", 1899, "5 days / 4 nights"),
    ("Santiago Wine & Andes", "Valparaíso colors, vineyards, and cordillera views.", "Chile", 1499, "5 days / 4 nights"),
    ("Bordeaux Vineyards", "Châteaux, river quays, and world-class reds.", "Bordeaux, France", 1799, "5 days / 4 nights"),
    ("Ljubljana Green Capital", "Dragon bridges, lake Bled day trip, and café culture.", "Slovenia", 1199, "5 days / 4 nights"),
    ("Phoenix Desert & Canyon", "Saguaro sunsets, Sedona red rocks, and spa resorts.", "Arizona, USA", 1299, "5 days / 4 nights"),
    ("Accra & Cape Coast", "Beaches, castles, and highlife rhythms.", "Ghana", 1499, "6 days / 5 nights"),
    ("Brisbane & Gold Coast", "River city, rainforest, and surf strips.", "Australia", 1599, "6 days / 5 nights"),
]


class Command(BaseCommand):
    help = "Insert 50+ tour packages if they do not already exist (by title)."

    def handle(self, *args, **options):
        created = 0
        skipped = 0
        for title, desc, loc, price, dur in RAW:
            if TourPackage.objects.filter(title=title).exists():
                skipped += 1
                continue
            TourPackage.objects.create(
                title=title,
                description=desc,
                location=loc.strip(),
                price=Decimal(str(price)),
                duration=dur,
            )
            created += 1
        self.stdout.write(self.style.SUCCESS(f"Created {created} packages, skipped {skipped} (already present)."))

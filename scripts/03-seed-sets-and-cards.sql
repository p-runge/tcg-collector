-- Insert sets for some popular series
INSERT INTO sets (series_id, name, code, release_date, total_cards) VALUES
-- Base Set series
((SELECT id FROM series WHERE name = 'Base Set'), 'Base Set', 'BS', '1998-10-20', 102),
((SELECT id FROM series WHERE name = 'Jungle'), 'Jungle', 'JU', '1999-06-16', 64),
((SELECT id FROM series WHERE name = 'Fossil'), 'Fossil', 'FO', '1999-10-10', 62),

-- Modern sets
((SELECT id FROM series WHERE name = 'Scarlet & Violet'), 'Scarlet & Violet Base Set', 'SVI', '2023-03-31', 198),
((SELECT id FROM series WHERE name = 'Paldea Evolved'), 'Paldea Evolved', 'PAL', '2023-06-09', 193),
((SELECT id FROM series WHERE name = '151'), 'Pokémon 151', 'MEW', '2023-06-16', 165),
((SELECT id FROM series WHERE name = 'Obsidian Flames'), 'Obsidian Flames', 'OBF', '2023-08-11', 197),

-- Classic popular sets
((SELECT id FROM series WHERE name = 'Team Rocket'), 'Team Rocket', 'TR', '2000-04-24', 83),
((SELECT id FROM series WHERE name = 'Neo Genesis'), 'Neo Genesis', 'N1', '2000-12-16', 111),
((SELECT id FROM series WHERE name = 'Evolutions'), 'Evolutions', 'EVO', '2016-11-02', 108),
((SELECT id FROM series WHERE name = 'Hidden Fates'), 'Hidden Fates', 'HIF', '2019-08-23', 69),
((SELECT id FROM series WHERE name = 'Celebrations'), 'Celebrations', 'CEL', '2021-10-08', 50)
ON CONFLICT (code) DO NOTHING;

-- Insert some iconic cards for Base Set
INSERT INTO cards (set_id, number, name, rarity, card_type) VALUES
-- Base Set cards
((SELECT id FROM sets WHERE code = 'BS'), '1', 'Alakazam', 'Holo Rare', 'Pokémon'),
((SELECT id FROM sets WHERE code = 'BS'), '2', 'Blastoise', 'Holo Rare', 'Pokémon'),
((SELECT id FROM sets WHERE code = 'BS'), '3', 'Chansey', 'Holo Rare', 'Pokémon'),
((SELECT id FROM sets WHERE code = 'BS'), '4', 'Charizard', 'Holo Rare', 'Pokémon'),
((SELECT id FROM sets WHERE code = 'BS'), '5', 'Clefairy', 'Holo Rare', 'Pokémon'),
((SELECT id FROM sets WHERE code = 'BS'), '6', 'Gyarados', 'Holo Rare', 'Pokémon'),
((SELECT id FROM sets WHERE code = 'BS'), '7', 'Hitmonchan', 'Holo Rare', 'Pokémon'),
((SELECT id FROM sets WHERE code = 'BS'), '8', 'Machamp', 'Holo Rare', 'Pokémon'),
((SELECT id FROM sets WHERE code = 'BS'), '9', 'Magneton', 'Holo Rare', 'Pokémon'),
((SELECT id FROM sets WHERE code = 'BS'), '10', 'Mewtwo', 'Holo Rare', 'Pokémon'),
((SELECT id FROM sets WHERE code = 'BS'), '11', 'Nidoking', 'Holo Rare', 'Pokémon'),
((SELECT id FROM sets WHERE code = 'BS'), '12', 'Ninetales', 'Holo Rare', 'Pokémon'),
((SELECT id FROM sets WHERE code = 'BS'), '13', 'Poliwrath', 'Holo Rare', 'Pokémon'),
((SELECT id FROM sets WHERE code = 'BS'), '14', 'Raichu', 'Holo Rare', 'Pokémon'),
((SELECT id FROM sets WHERE code = 'BS'), '15', 'Venomoth', 'Holo Rare', 'Pokémon'),
((SELECT id FROM sets WHERE code = 'BS'), '16', 'Venusaur', 'Holo Rare', 'Pokémon'),
((SELECT id FROM sets WHERE code = 'BS'), '17', 'Beedrill', 'Rare', 'Pokémon'),
((SELECT id FROM sets WHERE code = 'BS'), '18', 'Dragonair', 'Rare', 'Pokémon'),
((SELECT id FROM sets WHERE code = 'BS'), '19', 'Dugtrio', 'Rare', 'Pokémon'),
((SELECT id FROM sets WHERE code = 'BS'), '20', 'Electabuzz', 'Rare', 'Pokémon'),
((SELECT id FROM sets WHERE code = 'BS'), '21', 'Electrode', 'Rare', 'Pokémon'),
((SELECT id FROM sets WHERE code = 'BS'), '22', 'Pidgeotto', 'Uncommon', 'Pokémon'),
((SELECT id FROM sets WHERE code = 'BS'), '23', 'Arcanine', 'Uncommon', 'Pokémon'),
((SELECT id FROM sets WHERE code = 'BS'), '24', 'Charmeleon', 'Uncommon', 'Pokémon'),
((SELECT id FROM sets WHERE code = 'BS'), '25', 'Dewgong', 'Uncommon', 'Pokémon'),
((SELECT id FROM sets WHERE code = 'BS'), '26', 'Dratini', 'Common', 'Pokémon'),
((SELECT id FROM sets WHERE code = 'BS'), '27', 'Farfetch''d', 'Common', 'Pokémon'),
((SELECT id FROM sets WHERE code = 'BS'), '28', 'Growlithe', 'Common', 'Pokémon'),
((SELECT id FROM sets WHERE code = 'BS'), '29', 'Haunter', 'Common', 'Pokémon'),
((SELECT id FROM sets WHERE code = 'BS'), '30', 'Ivysaur', 'Common', 'Pokémon'),

-- Some Scarlet & Violet cards
((SELECT id FROM sets WHERE code = 'SVI'), '1', 'Sprigatito', 'Common', 'Pokémon'),
((SELECT id FROM sets WHERE code = 'SVI'), '2', 'Floragato', 'Uncommon', 'Pokémon'),
((SELECT id FROM sets WHERE code = 'SVI'), '3', 'Meowscarada', 'Rare', 'Pokémon'),
((SELECT id FROM sets WHERE code = 'SVI'), '4', 'Fuecoco', 'Common', 'Pokémon'),
((SELECT id FROM sets WHERE code = 'SVI'), '5', 'Crocalor', 'Uncommon', 'Pokémon'),
((SELECT id FROM sets WHERE code = 'SVI'), '6', 'Skeledirge', 'Rare', 'Pokémon'),
((SELECT id FROM sets WHERE code = 'SVI'), '7', 'Quaxly', 'Common', 'Pokémon'),
((SELECT id FROM sets WHERE code = 'SVI'), '8', 'Quaxwell', 'Uncommon', 'Pokémon'),
((SELECT id FROM sets WHERE code = 'SVI'), '9', 'Quaquaval', 'Rare', 'Pokémon'),
((SELECT id FROM sets WHERE code = 'SVI'), '198', 'Charizard ex', 'Special Illustration Rare', 'Pokémon'),

-- Pokémon 151 cards
((SELECT id FROM sets WHERE code = 'MEW'), '1', 'Bulbasaur', 'Common', 'Pokémon'),
((SELECT id FROM sets WHERE code = 'MEW'), '2', 'Ivysaur', 'Uncommon', 'Pokémon'),
((SELECT id FROM sets WHERE code = 'MEW'), '3', 'Venusaur ex', 'Double Rare', 'Pokémon'),
((SELECT id FROM sets WHERE code = 'MEW'), '4', 'Charmander', 'Common', 'Pokémon'),
((SELECT id FROM sets WHERE code = 'MEW'), '5', 'Charmeleon', 'Uncommon', 'Pokémon'),
((SELECT id FROM sets WHERE code = 'MEW'), '6', 'Charizard ex', 'Double Rare', 'Pokémon'),
((SELECT id FROM sets WHERE code = 'MEW'), '150', 'Mewtwo ex', 'Double Rare', 'Pokémon'),
((SELECT id FROM sets WHERE code = 'MEW'), '151', 'Mew ex', 'Double Rare', 'Pokémon'),
((SELECT id FROM sets WHERE code = 'MEW'), '165', 'Mew', 'Special Illustration Rare', 'Pokémon')
ON CONFLICT (set_id, number) DO NOTHING;

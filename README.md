# Firebase 
This is the deployed branch.

# Running the site locally
1. Download the latest site zip file, or clone with github
2. Install NPM and NodeJS. Follow the instructions from the official site: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm
3. Execute `npm run dev` on the command line, while in the project root directory
4. You will see a line that reads something like `➜  Local:   http://localhost:3000/`
5. Copy the URL from your command line and paste it in to your browser.

Do not host on the public internet this way.

# Polehammer: Chivalry II Weapon Comparison Tool
* Available at [polehammer.net](https://polehammer.net)
* Compare any combination of weapons using quantitative values for damage, range, and speed.
* Visualize the damage output changes based on damage type against a given target (**Vanguard/Archer, Footman, Knight**).
* Break down categories by attack type (**Slash, Overhead, Stab**) and strength (**Light, Heavy**) to see what changes.
* Share your discoveries with friends by copying and pasting the URL or clicking the Share button.
* Examine and use the underlying **JSON** data (`/src/weapons`)
* Please submit pull requests for weapon stats that are incorrect as the game is updated or as weapons are added!
<img width="640" alt="Screen Shot 2022-05-11 at 12 11 49 AM" src="https://user-images.githubusercontent.com/1251092/167790496-d3ca93d4-8e6a-4a89-8374-3d1c5e0ceda9.png">

# Updated Credits
* Aardvarkk - Website Design, Application Design, Radar Graphs
* Gimmic - Provided method for accessing weapon stats directly from game code, developer of [Chivstats.xyz](https://chivstats.xyz)
* Jacoby6000 - JSON Data Model, Responsive Design, Bar Graphs, Updated Category Selection UI, "PolehammerPoster" ChatGPT4 Bot Integration, Maintenance and Updates
* Nihilianth - Provided the most recent patch's weapon stats data file, collaboration with Chiv II DeepStats 
* Platyplysm - Range Stats, developer of the "Jeoffrey" range unit measurement system
* PolehammerSupremacy - Professor of Polehammer 
* Ziggylata - Deciphering strange sprint attack data

# Legacy Credits (before July 2023)
* Aardvarkk - Website Design, Application Design, Radar Graphs
* Bungee - Damage stats
* Gusaneishon - In-game stat bar corrections
* HowlingWolf067 - Throwing damage stats
* Jacoby6000 - JSON Data Model, Responsive Design, Bar Graphs
* KingLouie - Damage stats
* Mario - Leap and Charge attack damage stats, all stats audit
* Municipalis - Damage stats
* Oswaldicus - Throwing damage stats
* Platyplysm - Range stats
* PolehammerSupremacy - Windup stats, stat aggregation

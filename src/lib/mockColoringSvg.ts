/**
 * Generates crisp, printable #000000 on #FFFFFF SVG coloring book pages.
 * Aspect ratio: 800x1050 (Standard 8.5x11 inch portrait proportions).
 * Built with thick coloring outlines, friendly character proportions, and engaging background elements.
 */

export interface SvgGeneratorOptions {
  variantIndex: 1 | 2 | 3 | 4;
  pageTitle: string;
  setting?: string;
  headcount?: number;
  subtitle?: string;
}

export function generateColoringSvg(options: SvgGeneratorOptions): string {
  const { variantIndex, pageTitle, setting = "Beach", headcount = 4, subtitle = "" } = options;

  let sceneContent = "";

  switch (variantIndex) {
    case 1:
      // Page 1: Faithful Keepsake Portrait
      sceneContent = `
        <!-- Page 1: Faithful Family Keepsake Portrait -->
        <!-- Sun and clouds -->
        <circle cx="120" cy="150" r="50" fill="#FFFFFF" stroke="#000000" stroke-width="4" stroke-dasharray="8 6"/>
        <line x1="120" y1="80" x2="120" y2="60" stroke="#000000" stroke-width="4" stroke-linecap="round"/>
        <line x1="120" y1="220" x2="120" y2="240" stroke="#000000" stroke-width="4" stroke-linecap="round"/>
        <line x1="50" y1="150" x2="30" y2="150" stroke="#000000" stroke-width="4" stroke-linecap="round"/>
        <line x1="190" y1="150" x2="210" y2="150" stroke="#000000" stroke-width="4" stroke-linecap="round"/>
        <line x1="70" y1="100" x2="55" y2="85" stroke="#000000" stroke-width="4" stroke-linecap="round"/>
        <line x1="170" y1="200" x2="185" y2="215" stroke="#000000" stroke-width="4" stroke-linecap="round"/>

        <!-- Clouds -->
        <path d="M 600,140 Q 620,110 660,120 Q 700,100 730,130 Q 760,150 740,180 Q 700,195 620,190 Q 590,170 600,140 Z" fill="#FFFFFF" stroke="#000000" stroke-width="4"/>
        <path d="M 280,180 Q 300,155 335,160 Q 370,145 395,170 Q 415,190 395,210 Q 340,220 295,210 Q 275,195 280,180 Z" fill="#FFFFFF" stroke="#000000" stroke-width="3"/>

        <!-- Distant shoreline / horizon -->
        <path d="M 40,380 Q 200,360 400,375 T 760,370" fill="none" stroke="#000000" stroke-width="3"/>
        <path d="M 40,430 Q 250,420 500,435 T 760,420" fill="none" stroke="#000000" stroke-width="3"/>
        <!-- Sailboat in distance -->
        <path d="M 640,350 L 670,300 L 670,350 Z" fill="#FFFFFF" stroke="#000000" stroke-width="3"/>
        <path d="M 675,320 L 695,350 L 675,350 Z" fill="#FFFFFF" stroke="#000000" stroke-width="3"/>
        <path d="M 630,355 Q 670,365 710,355 L 700,370 L 640,370 Z" fill="#FFFFFF" stroke="#000000" stroke-width="3"/>

        <!-- Family Characters Center Grouping -->
        <!-- Parent 1 (Left - Dad with sunglasses) -->
        <g id="parent1" transform="translate(140, 410)">
          <!-- Body / Beach Shirt -->
          <path d="M 50,160 L 20,330 L 140,330 L 110,160 Z" fill="#FFFFFF" stroke="#000000" stroke-width="4"/>
          <!-- Collar & Buttons -->
          <path d="M 60,160 L 80,210 L 100,160" fill="none" stroke="#000000" stroke-width="3"/>
          <line x1="80" y1="210" x2="80" y2="330" stroke="#000000" stroke-width="3"/>
          <circle cx="80" cy="240" r="3" fill="#000000"/>
          <circle cx="80" cy="275" r="3" fill="#000000"/>
          <circle cx="80" cy="310" r="3" fill="#000000"/>
          <!-- Floral pattern hints on shirt -->
          <path d="M 40,240 Q 50,230 60,240 Q 50,250 40,240" stroke="#000000" stroke-width="2" fill="none"/>
          <path d="M 100,280 Q 110,270 120,280 Q 110,290 100,280" stroke="#000000" stroke-width="2" fill="none"/>
          <!-- Arms -->
          <path d="M 50,160 Q 10,220 20,280" stroke="#000000" stroke-width="4" fill="none"/>
          <path d="M 110,160 Q 140,200 160,230" stroke="#000000" stroke-width="4" fill="none"/>
          <!-- Neck & Head -->
          <rect x="68" y="130" width="24" height="30" fill="#FFFFFF" stroke="#000000" stroke-width="3"/>
          <circle cx="80" cy="95" r="45" fill="#FFFFFF" stroke="#000000" stroke-width="4"/>
          <!-- Hair & Hat -->
          <path d="M 35,80 Q 80,45 125,80" fill="#FFFFFF" stroke="#000000" stroke-width="4"/>
          <path d="M 25,75 Q 80,30 135,75 L 140,65 Q 80,20 20,65 Z" fill="#FFFFFF" stroke="#000000" stroke-width="4"/>
          <!-- Sunglasses & Smile -->
          <rect x="52" y="85" width="24" height="16" rx="4" fill="#FFFFFF" stroke="#000000" stroke-width="3"/>
          <rect x="84" y="85" width="24" height="16" rx="4" fill="#FFFFFF" stroke="#000000" stroke-width="3"/>
          <line x1="76" y1="92" x2="84" y2="92" stroke="#000000" stroke-width="3"/>
          <!-- Big Grin -->
          <path d="M 65,115 Q 80,130 95,115" stroke="#000000" stroke-width="3" fill="none"/>
        </g>

        <!-- Kid 1 (Sitting/Front left with ice cream) -->
        <g id="kid1" transform="translate(260, 480)">
          <!-- Legs sitting on sand -->
          <path d="M 30,220 Q 5,245 40,255 L 70,250" stroke="#000000" stroke-width="4" fill="#FFFFFF"/>
          <path d="M 70,250 L 100,255 Q 135,245 110,220" stroke="#000000" stroke-width="4" fill="#FFFFFF"/>
          <!-- T-Shirt -->
          <path d="M 40,130 L 25,230 L 115,230 L 100,130 Z" fill="#FFFFFF" stroke="#000000" stroke-width="4"/>
          <circle cx="70" cy="175" r="15" fill="#FFFFFF" stroke="#000000" stroke-width="3" stroke-dasharray="4 3"/>
          <!-- Neck & Head -->
          <rect x="62" y="110" width="16" height="20" fill="#FFFFFF" stroke="#000000" stroke-width="3"/>
          <circle cx="70" cy="80" r="36" fill="#FFFFFF" stroke="#000000" stroke-width="4"/>
          <!-- Cheerful Face -->
          <circle cx="58" cy="74" r="5" fill="#000000"/>
          <circle cx="82" cy="74" r="5" fill="#000000"/>
          <path d="M 58,95 Q 70,110 82,95" stroke="#000000" stroke-width="3" fill="none"/>
          <!-- Curly Hair -->
          <path d="M 40,65 Q 45,45 60,50 Q 70,40 80,48 Q 95,45 100,65" fill="#FFFFFF" stroke="#000000" stroke-width="3.5"/>
          <!-- Arm holding ice cream cone -->
          <path d="M 95,150 Q 120,165 125,145" stroke="#000000" stroke-width="4" fill="none"/>
          <path d="M 120,150 L 132,180 L 140,150 Z" fill="#FFFFFF" stroke="#000000" stroke-width="3"/>
          <circle cx="130" cy="142" r="14" fill="#FFFFFF" stroke="#000000" stroke-width="3"/>
          <circle cx="130" cy="126" r="10" fill="#FFFFFF" stroke="#000000" stroke-width="3"/>
        </g>

        <!-- Parent 2 (Right - Mom with sun hat) -->
        <g id="parent2" transform="translate(420, 395)">
          <!-- Sundress -->
          <path d="M 60,170 L 15,350 L 145,350 L 100,170 Z" fill="#FFFFFF" stroke="#000000" stroke-width="4"/>
          <!-- Pattern on dress -->
          <circle cx="45" cy="230" r="8" stroke="#000000" stroke-width="2" fill="none"/>
          <circle cx="80" cy="270" r="10" stroke="#000000" stroke-width="2" fill="none"/>
          <circle cx="115" cy="240" r="8" stroke="#000000" stroke-width="2" fill="none"/>
          <circle cx="60" cy="315" r="9" stroke="#000000" stroke-width="2" fill="none"/>
          <circle cx="100" cy="320" r="9" stroke="#000000" stroke-width="2" fill="none"/>
          <!-- Arms -->
          <path d="M 60,175 Q 35,225 30,285" stroke="#000000" stroke-width="4" fill="none"/>
          <path d="M 100,175 Q 130,225 125,290" stroke="#000000" stroke-width="4" fill="none"/>
          <!-- Neck & Head -->
          <rect x="68" y="145" width="24" height="25" fill="#FFFFFF" stroke="#000000" stroke-width="3"/>
          <circle cx="80" cy="110" r="42" fill="#FFFFFF" stroke="#000000" stroke-width="4"/>
          <!-- Sun Hat (Wide Brim) -->
          <ellipse cx="80" cy="85" rx="75" ry="24" fill="#FFFFFF" stroke="#000000" stroke-width="4"/>
          <path d="M 45,85 Q 80,40 115,85" fill="#FFFFFF" stroke="#000000" stroke-width="3.5"/>
          <!-- Hair flowing down -->
          <path d="M 38,105 Q 35,160 50,175" stroke="#000000" stroke-width="3.5" fill="none"/>
          <path d="M 122,105 Q 125,160 110,175" stroke="#000000" stroke-width="3.5" fill="none"/>
          <!-- Happy Face -->
          <circle cx="66" cy="108" r="4.5" fill="#000000"/>
          <circle cx="94" cy="108" r="4.5" fill="#000000"/>
          <path d="M 68,124 Q 80,136 92,124" stroke="#000000" stroke-width="3" fill="none"/>
        </g>

        <!-- Kid 2 / Toddler (Center right laughing with beach ball) -->
        <g id="kid2" transform="translate(560, 490)">
          <!-- Shorts & Top -->
          <path d="M 30,130 L 15,220 L 85,220 L 70,130 Z" fill="#FFFFFF" stroke="#000000" stroke-width="4"/>
          <path d="M 15,220 L 10,250 L 45,250 L 50,220" stroke="#000000" stroke-width="3" fill="#FFFFFF"/>
          <path d="M 50,220 L 55,250 L 90,250 L 85,220" stroke="#000000" stroke-width="3" fill="#FFFFFF"/>
          <!-- Head -->
          <circle cx="50" cy="85" r="34" fill="#FFFFFF" stroke="#000000" stroke-width="4"/>
          <!-- Cap turned backwards -->
          <path d="M 22,75 Q 50,50 78,75" fill="#FFFFFF" stroke="#000000" stroke-width="3.5"/>
          <path d="M 75,70 Q 95,65 92,80" fill="#FFFFFF" stroke="#000000" stroke-width="3"/>
          <circle cx="40" cy="85" r="4" fill="#000000"/>
          <circle cx="60" cy="85" r="4" fill="#000000"/>
          <path d="M 40,98 Q 50,110 60,98" stroke="#000000" stroke-width="3" fill="none"/>
          <!-- Holding Beach Ball -->
          <circle cx="100" cy="160" r="32" fill="#FFFFFF" stroke="#000000" stroke-width="4"/>
          <path d="M 100,128 Q 80,160 100,192" stroke="#000000" stroke-width="3" fill="none"/>
          <path d="M 100,128 Q 120,160 100,192" stroke="#000000" stroke-width="3" fill="none"/>
        </g>

        <!-- Foreground Sand & Shells -->
        <path d="M 40,780 Q 200,750 400,770 T 760,760" fill="none" stroke="#000000" stroke-width="4"/>
        <!-- Starfish & Seashells -->
        <g transform="translate(100, 780)">
          <!-- Starfish -->
          <polygon points="50,10 62,38 92,40 68,58 76,88 50,70 24,88 32,58 8,40 38,38" fill="#FFFFFF" stroke="#000000" stroke-width="3"/>
          <circle cx="50" cy="50" r="4" stroke="#000000" stroke-width="2" fill="none"/>
        </g>
        <g transform="translate(680, 790)">
          <!-- Scallop Shell -->
          <path d="M 20,40 Q 40,10 60,40 Q 50,60 40,65 Q 30,60 20,40 Z" fill="#FFFFFF" stroke="#000000" stroke-width="3"/>
          <line x1="40" y1="65" x2="25" y2="35" stroke="#000000" stroke-width="2"/>
          <line x1="40" y1="65" x2="40" y2="25" stroke="#000000" stroke-width="2"/>
          <line x1="40" y1="65" x2="55" y2="35" stroke="#000000" stroke-width="2"/>
        </g>
      `;
      break;

    case 2:
      // Page 2: Sandcastle Architects
      sceneContent = `
        <!-- Page 2: Sandcastle Architects -->
        <!-- Sun with sunglasses -->
        <circle cx="680" cy="140" r="55" fill="#FFFFFF" stroke="#000000" stroke-width="4"/>
        <line x1="680" y1="70" x2="680" y2="45" stroke="#000000" stroke-width="4" stroke-linecap="round"/>
        <line x1="680" y1="210" x2="680" y2="235" stroke="#000000" stroke-width="4" stroke-linecap="round"/>
        <line x1="610" y1="140" x2="585" y2="140" stroke="#000000" stroke-width="4" stroke-linecap="round"/>
        <line x1="750" y1="140" x2="775" y2="140" stroke="#000000" stroke-width="4" stroke-linecap="round"/>
        <!-- Sun sunglasses -->
        <polygon points="650,130 670,130 668,145 652,145" fill="#FFFFFF" stroke="#000000" stroke-width="3"/>
        <polygon points="685,130 705,130 703,145 687,145" fill="#FFFFFF" stroke="#000000" stroke-width="3"/>
        <line x1="670" y1="135" x2="685" y2="135" stroke="#000000" stroke-width="3"/>
        <path d="M 665,160 Q 680,170 695,160" stroke="#000000" stroke-width="3" fill="none"/>

        <!-- Flying Seagulls -->
        <path d="M 150,120 Q 170,105 185,120 Q 200,105 220,120" stroke="#000000" stroke-width="3.5" fill="none"/>
        <path d="M 260,95 Q 275,85 285,95 Q 295,85 310,95" stroke="#000000" stroke-width="3" fill="none"/>

        <!-- Giant Epic Sandcastle in Center -->
        <g id="giant-sandcastle" transform="translate(240, 290)">
          <!-- Main Fortress Base -->
          <rect x="50" y="240" width="220" height="180" rx="8" fill="#FFFFFF" stroke="#000000" stroke-width="4"/>
          <!-- Brick details on castle -->
          <line x1="50" y1="290" x2="270" y2="290" stroke="#000000" stroke-width="2" stroke-dasharray="25 15"/>
          <line x1="50" y1="340" x2="270" y2="340" stroke="#000000" stroke-width="2" stroke-dasharray="15 25"/>
          <line x1="50" y1="390" x2="270" y2="390" stroke="#000000" stroke-width="2" stroke-dasharray="20 20"/>

          <!-- Archway Gate -->
          <path d="M 120,420 L 120,330 Q 160,290 200,330 L 200,420 Z" fill="#FFFFFF" stroke="#000000" stroke-width="4"/>
          <circle cx="135" cy="370" r="4" fill="#000000"/>
          <circle cx="185" cy="370" r="4" fill="#000000"/>

          <!-- Center High Tower -->
          <rect x="110" y="100" width="100" height="140" fill="#FFFFFF" stroke="#000000" stroke-width="4"/>
          <!-- Battlements on Tower -->
          <polygon points="100,100 100,70 120,70 120,85 145,85 145,70 175,70 175,85 200,85 200,70 220,70 220,100" fill="#FFFFFF" stroke="#000000" stroke-width="3.5"/>
          <!-- Tower Flag -->
          <line x1="160" y1="70" x2="160" y2="10" stroke="#000000" stroke-width="3.5"/>
          <polygon points="160,10 220,30 160,50" fill="#FFFFFF" stroke="#000000" stroke-width="3"/>
          <circle cx="180" cy="30" r="5" stroke="#000000" stroke-width="2" fill="none"/>

          <!-- Left Tower -->
          <rect x="10" y="160" width="60" height="130" fill="#FFFFFF" stroke="#000000" stroke-width="4"/>
          <polygon points="5,160 40,90 75,160" fill="#FFFFFF" stroke="#000000" stroke-width="3.5"/>
          <line x1="40" y1="90" x2="40" y2="50" stroke="#000000" stroke-width="3"/>
          <polygon points="40,50 70,65 40,80" fill="#FFFFFF" stroke="#000000" stroke-width="2.5"/>

          <!-- Right Tower -->
          <rect x="250" y="160" width="60" height="130" fill="#FFFFFF" stroke="#000000" stroke-width="4"/>
          <polygon points="245,160 280,90 315,160" fill="#FFFFFF" stroke="#000000" stroke-width="3.5"/>
          <line x1="280" y1="90" x2="280" y2="50" stroke="#000000" stroke-width="3"/>
          <polygon points="280,50 310,65 280,80" fill="#FFFFFF" stroke="#000000" stroke-width="2.5"/>

          <!-- Windows on towers -->
          <path d="M 140,140 Q 160,120 180,140 L 180,180 L 140,180 Z" fill="#FFFFFF" stroke="#000000" stroke-width="3"/>
          <path d="M 30,200 Q 40,190 50,200 L 50,225 L 30,225 Z" fill="#FFFFFF" stroke="#000000" stroke-width="2.5"/>
          <path d="M 270,200 Q 280,190 290,200 L 290,225 L 270,225 Z" fill="#FFFFFF" stroke="#000000" stroke-width="2.5"/>
        </g>

        <!-- Kid Building Left Side with Shovel -->
        <g id="builder-kid-left" transform="translate(100, 520)">
          <!-- Legs -->
          <path d="M 40,160 L 25,230 L 55,230 L 60,160" stroke="#000000" stroke-width="4" fill="#FFFFFF"/>
          <path d="M 65,160 L 70,230 L 100,230 L 85,160" stroke="#000000" stroke-width="4" fill="#FFFFFF"/>
          <!-- Shirt -->
          <path d="M 35,90 L 20,165 L 105,165 L 90,90 Z" fill="#FFFFFF" stroke="#000000" stroke-width="4"/>
          <!-- Head with Sunvisor -->
          <circle cx="62" cy="55" r="30" fill="#FFFFFF" stroke="#000000" stroke-width="4"/>
          <path d="M 35,48 L 95,48 L 88,40 L 40,40 Z" fill="#FFFFFF" stroke="#000000" stroke-width="3"/>
          <circle cx="55" cy="55" r="3.5" fill="#000000"/>
          <circle cx="72" cy="55" r="3.5" fill="#000000"/>
          <path d="M 55,68 Q 63,76 72,68" stroke="#000000" stroke-width="3" fill="none"/>
          <!-- Arm holding big shovel -->
          <path d="M 85,110 L 130,130" stroke="#000000" stroke-width="4"/>
          <!-- Plastic Shovel -->
          <line x1="120" y1="100" x2="160" y2="230" stroke="#000000" stroke-width="6"/>
          <rect x="145" y="210" width="35" height="40" rx="4" fill="#FFFFFF" stroke="#000000" stroke-width="4"/>
        </g>

        <!-- Kid Decorating Right Side with Bucket -->
        <g id="builder-kid-right" transform="translate(580, 530)">
          <!-- Legs -->
          <path d="M 30,150 L 15,220 L 45,220 L 50,150" stroke="#000000" stroke-width="4" fill="#FFFFFF"/>
          <path d="M 55,150 L 60,220 L 90,220 L 75,150" stroke="#000000" stroke-width="4" fill="#FFFFFF"/>
          <!-- Shirt -->
          <path d="M 25,85 L 15,155 L 85,155 L 75,85 Z" fill="#FFFFFF" stroke="#000000" stroke-width="4"/>
          <!-- Head -->
          <circle cx="50" cy="50" r="28" fill="#FFFFFF" stroke="#000000" stroke-width="4"/>
          <!-- Pigtails -->
          <circle cx="20" cy="45" r="10" fill="#FFFFFF" stroke="#000000" stroke-width="3"/>
          <circle cx="80" cy="45" r="10" fill="#FFFFFF" stroke="#000000" stroke-width="3"/>
          <circle cx="42" cy="50" r="3.5" fill="#000000"/>
          <circle cx="58" cy="50" r="3.5" fill="#000000"/>
          <path d="M 43,62 Q 50,70 58,62" stroke="#000000" stroke-width="3" fill="none"/>
          <!-- Arm holding bucket -->
          <path d="M 25,100 L -15,140" stroke="#000000" stroke-width="4"/>
          <!-- Sand Bucket tipped over with sand pile -->
          <polygon points="-35,140 -5,140 -12,185 -28,185" fill="#FFFFFF" stroke="#000000" stroke-width="4"/>
          <path d="M -35,140 Q -20,120 -5,140" stroke="#000000" stroke-width="3" fill="none"/>
        </g>

        <!-- Friendly Crab helper in foreground -->
        <g id="friendly-crab" transform="translate(360, 710)">
          <ellipse cx="40" cy="40" rx="35" ry="24" fill="#FFFFFF" stroke="#000000" stroke-width="3.5"/>
          <!-- Crab Eyes on stalks -->
          <line x1="30" y1="20" x2="25" y2="5" stroke="#000000" stroke-width="3"/>
          <circle cx="25" cy="5" r="7" fill="#FFFFFF" stroke="#000000" stroke-width="3"/>
          <circle cx="25" cy="5" r="3" fill="#000000"/>
          <line x1="50" y1="20" x2="55" y2="5" stroke="#000000" stroke-width="3"/>
          <circle cx="55" cy="5" r="7" fill="#FFFFFF" stroke="#000000" stroke-width="3"/>
          <circle cx="55" cy="5" r="3" fill="#000000"/>
          <!-- Crab Smile -->
          <path d="M 28,45 Q 40,55 52,45" stroke="#000000" stroke-width="3" fill="none"/>
          <!-- Claws -->
          <path d="M 10,35 Q -15,20 -10,-5 Q 10,-10 5,20" stroke="#000000" stroke-width="3.5" fill="#FFFFFF"/>
          <path d="M 70,35 Q 95,20 90,-5 Q 70,-10 75,20" stroke="#000000" stroke-width="3.5" fill="#FFFFFF"/>
          <!-- Little legs -->
          <path d="M 15,55 Q -5,70 5,80" stroke="#000000" stroke-width="3" fill="none"/>
          <path d="M 25,60 Q 15,80 25,90" stroke="#000000" stroke-width="3" fill="none"/>
          <path d="M 65,55 Q 85,70 75,80" stroke="#000000" stroke-width="3" fill="none"/>
          <path d="M 55,60 Q 65,80 55,90" stroke="#000000" stroke-width="3" fill="none"/>
        </g>
      `;
      break;

    case 3:
      // Page 3: Ocean Friends Playtime
      sceneContent = `
        <!-- Page 3: Ocean Friends Playtime -->
        <!-- Water surface waves at the top -->
        <path d="M 40,160 Q 120,130 200,160 T 360,160 T 520,160 T 680,160 T 760,160" fill="none" stroke="#000000" stroke-width="4"/>
        <path d="M 40,185 Q 120,155 200,185 T 360,185 T 520,185 T 680,185 T 760,185" fill="none" stroke="#000000" stroke-width="3" stroke-dasharray="8 6"/>

        <!-- Jumping Dolphin at top right -->
        <g id="dolphin" transform="translate(480, 80)">
          <path d="M 40,90 Q 90,10 160,20 Q 220,35 240,90 Q 210,95 180,80 Q 140,85 100,105 Q 60,110 40,90 Z" fill="#FFFFFF" stroke="#000000" stroke-width="4"/>
          <!-- Tail flukes -->
          <path d="M 40,90 Q 20,70 10,80 Q 25,95 30,100 Q 15,115 10,125 Q 30,120 45,100" fill="#FFFFFF" stroke="#000000" stroke-width="3.5"/>
          <!-- Dorsal Fin & Flipper -->
          <path d="M 140,25 Q 160,0 175,25 Z" fill="#FFFFFF" stroke="#000000" stroke-width="3.5"/>
          <path d="M 160,70 Q 180,95 190,85 Q 185,70 170,65" fill="#FFFFFF" stroke="#000000" stroke-width="3"/>
          <!-- Dolphin Eye & Smile -->
          <circle cx="215" cy="55" r="4" fill="#000000"/>
          <path d="M 215,65 Q 225,72 235,65" stroke="#000000" stroke-width="2.5" fill="none"/>
        </g>

        <!-- Snorkeling Kid swimming underwater -->
        <g id="snorkeling-kid" transform="translate(140, 240)">
          <!-- Swimming body -->
          <path d="M 70,80 Q 130,50 200,70 L 220,130 Q 150,140 80,110 Z" fill="#FFFFFF" stroke="#000000" stroke-width="4"/>
          <!-- Swimming Fins -->
          <path d="M 50,85 L 10,60 L 15,110 L 60,95 Z" fill="#FFFFFF" stroke="#000000" stroke-width="3.5"/>
          <path d="M 55,95 L 20,105 L 25,145 L 65,110 Z" fill="#FFFFFF" stroke="#000000" stroke-width="3.5"/>
          <!-- Head with Snorkel Mask -->
          <circle cx="240" cy="85" r="32" fill="#FFFFFF" stroke="#000000" stroke-width="4"/>
          <!-- Mask -->
          <rect x="235" y="70" width="30" height="25" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="3.5"/>
          <!-- Mask strap -->
          <line x1="215" y1="82" x2="235" y2="82" stroke="#000000" stroke-width="3"/>
          <!-- Eyes behind glass -->
          <circle cx="245" cy="82" r="3.5" fill="#000000"/>
          <circle cx="258" cy="82" r="3.5" fill="#000000"/>
          <!-- Snorkel tube -->
          <path d="M 255,95 L 255,108 Q 280,112 280,40 L 290,40" stroke="#000000" stroke-width="4" fill="none"/>
          <!-- Arms paddling -->
          <path d="M 180,105 Q 190,145 220,150" stroke="#000000" stroke-width="4" fill="none"/>
        </g>

        <!-- Sea Turtle swimming along -->
        <g id="sea-turtle" transform="translate(420, 390)">
          <!-- Shell -->
          <ellipse cx="100" cy="80" rx="70" ry="50" fill="#FFFFFF" stroke="#000000" stroke-width="4"/>
          <!-- Shell Scutes / Hexagonal Pattern -->
          <polygon points="100,50 125,65 125,95 100,110 75,95 75,65" fill="#FFFFFF" stroke="#000000" stroke-width="3"/>
          <polygon points="50,45 70,55 70,80 50,85 35,70" fill="#FFFFFF" stroke="#000000" stroke-width="2.5"/>
          <polygon points="150,45 165,70 150,85 130,80 130,55" fill="#FFFFFF" stroke="#000000" stroke-width="2.5"/>
          <!-- Head -->
          <ellipse cx="185" cy="80" rx="22" ry="16" fill="#FFFFFF" stroke="#000000" stroke-width="3.5"/>
          <circle cx="192" cy="76" r="3.5" fill="#000000"/>
          <path d="M 190,85 Q 197,90 202,85" stroke="#000000" stroke-width="2" fill="none"/>
          <!-- Front Flippers -->
          <path d="M 130,40 Q 150,-10 185,-5 Q 170,30 145,45" fill="#FFFFFF" stroke="#000000" stroke-width="3.5"/>
          <path d="M 130,120 Q 150,170 185,165 Q 170,130 145,115" fill="#FFFFFF" stroke="#000000" stroke-width="3.5"/>
          <!-- Back Flippers -->
          <path d="M 45,50 Q 25,30 20,45 Q 30,65 45,60" fill="#FFFFFF" stroke="#000000" stroke-width="3"/>
          <path d="M 45,110 Q 25,130 20,115 Q 30,95 45,100" fill="#FFFFFF" stroke="#000000" stroke-width="3"/>
        </g>

        <!-- Cute clownfish / tropical fish -->
        <g id="fish1" transform="translate(180, 560)">
          <path d="M 30,40 Q 60,10 90,40 Q 60,70 30,40 Z" fill="#FFFFFF" stroke="#000000" stroke-width="3.5"/>
          <polygon points="30,40 10,20 15,60" fill="#FFFFFF" stroke="#000000" stroke-width="3"/>
          <!-- Stripes -->
          <path d="M 50,22 Q 55,40 50,58" stroke="#000000" stroke-width="3" fill="none"/>
          <path d="M 70,25 Q 75,40 70,55" stroke="#000000" stroke-width="3" fill="none"/>
          <circle cx="80" cy="35" r="3" fill="#000000"/>
        </g>

        <!-- Bubbles floating up -->
        <circle cx="340" cy="220" r="14" fill="#FFFFFF" stroke="#000000" stroke-width="3"/>
        <path d="M 335,214 A 6 6 0 0 1 345,214" stroke="#000000" stroke-width="2" fill="none"/>
        <circle cx="360" cy="180" r="10" fill="#FFFFFF" stroke="#000000" stroke-width="2.5"/>
        <circle cx="330" cy="150" r="7" fill="#FFFFFF" stroke="#000000" stroke-width="2"/>
        <circle cx="380" cy="130" r="12" fill="#FFFFFF" stroke="#000000" stroke-width="2.5"/>

        <!-- Coral Reef Seabed at Bottom -->
        <g id="coral-reef" transform="translate(40, 680)">
          <!-- Sandy sea floor -->
          <path d="M 0,160 Q 200,140 400,150 T 720,145" fill="none" stroke="#000000" stroke-width="4"/>
          <!-- Brain Coral -->
          <path d="M 60,150 C 40,80 120,80 140,150" fill="#FFFFFF" stroke="#000000" stroke-width="3.5"/>
          <path d="M 75,140 Q 80,110 100,115 Q 120,110 125,140" stroke="#000000" stroke-width="2.5" fill="none"/>
          <!-- Sea Anemone / Seaweed stalks -->
          <path d="M 220,150 Q 210,70 240,20 Q 255,70 235,150" fill="#FFFFFF" stroke="#000000" stroke-width="3"/>
          <path d="M 240,150 Q 250,90 280,30 Q 285,90 255,150" fill="#FFFFFF" stroke="#000000" stroke-width="3"/>
          <path d="M 260,150 Q 280,100 310,50 Q 305,100 275,150" fill="#FFFFFF" stroke="#000000" stroke-width="3"/>
          <!-- Giant Clam with Pearl -->
          <g transform="translate(460, 80)">
            <path d="M 20,65 Q 60,15 100,65 Z" fill="#FFFFFF" stroke="#000000" stroke-width="3.5"/>
            <path d="M 20,65 Q 60,90 100,65 Z" fill="#FFFFFF" stroke="#000000" stroke-width="3.5"/>
            <circle cx="60" cy="62" r="12" fill="#FFFFFF" stroke="#000000" stroke-width="3"/>
            <path d="M 35,65 L 45,30" stroke="#000000" stroke-width="2"/>
            <path d="M 60,65 L 60,25" stroke="#000000" stroke-width="2"/>
            <path d="M 85,65 L 75,30" stroke="#000000" stroke-width="2"/>
          </g>
          <!-- Starfish on seafloor -->
          <polygon points="630,120 638,138 658,140 642,152 648,172 630,160 612,172 618,152 602,140 622,138" fill="#FFFFFF" stroke="#000000" stroke-width="3"/>
        </g>
      `;
      break;

    case 4:
      // Page 4: Beach Day Souvenir
      sceneContent = `
        <!-- Page 4: Beach Day Souvenir Banner & Campfire Sunset -->
        <!-- Decorative Header Banner Ribbon -->
        <g id="souvenir-banner" transform="translate(150, 80)">
          <path d="M 20,40 L 480,40 L 460,100 L 40,100 Z" fill="#FFFFFF" stroke="#000000" stroke-width="4"/>
          <!-- Ribbon tails -->
          <polygon points="20,40 -20,20 -5,65 -20,110 25,95 20,40" fill="#FFFFFF" stroke="#000000" stroke-width="3.5"/>
          <polygon points="480,40 520,20 505,65 520,110 475,95 480,40" fill="#FFFFFF" stroke="#000000" stroke-width="3.5"/>
          <!-- Text inside banner -->
          <text x="250" y="82" font-family="'Comic Sans MS', 'Arial Rounded MT Bold', sans-serif" font-size="28" font-weight="900" text-anchor="middle" fill="#000000" letter-spacing="3">VACATION MEMORIES</text>
        </g>

        <!-- Big Radiant Sunset Over Water -->
        <g id="sunset" transform="translate(400, 310)">
          <path d="M -160,0 A 160 160 0 0 1 160,0 Z" fill="#FFFFFF" stroke="#000000" stroke-width="4"/>
          <!-- Sunrays -->
          <line x1="0" y1="-170" x2="0" y2="-210" stroke="#000000" stroke-width="4" stroke-linecap="round"/>
          <line x1="-90" y1="-140" x2="-120" y2="-180" stroke="#000000" stroke-width="4" stroke-linecap="round"/>
          <line x1="90" y1="-140" x2="120" y2="-180" stroke="#000000" stroke-width="4" stroke-linecap="round"/>
          <line x1="-160" y1="-60" x2="-200" y2="-80" stroke="#000000" stroke-width="4" stroke-linecap="round"/>
          <line x1="160" y1="-60" x2="200" y2="-80" stroke="#000000" stroke-width="4" stroke-linecap="round"/>
          <!-- Horizon Water line -->
          <line x1="-340" y1="0" x2="340" y2="0" stroke="#000000" stroke-width="4"/>
          <!-- Sun reflection lines -->
          <line x1="-80" y1="20" x2="80" y2="20" stroke="#000000" stroke-width="3"/>
          <line x1="-60" y1="40" x2="60" y2="40" stroke="#000000" stroke-width="3"/>
          <line x1="-40" y1="60" x2="40" y2="60" stroke="#000000" stroke-width="3"/>
          <line x1="-20" y1="80" x2="20" y2="80" stroke="#000000" stroke-width="3"/>
        </g>

        <!-- Two Palm Trees Framing Left and Right -->
        <!-- Left Palm Tree -->
        <g id="left-palm" transform="translate(80, 260)">
          <path d="M 60,320 Q 80,180 50,40 L 70,40 Q 105,180 85,320 Z" fill="#FFFFFF" stroke="#000000" stroke-width="4"/>
          <!-- Palm Trunk Segments -->
          <line x1="62" y1="260" x2="82" y2="260" stroke="#000000" stroke-width="2.5"/>
          <line x1="65" y1="200" x2="88" y2="200" stroke="#000000" stroke-width="2.5"/>
          <line x1="66" y1="140" x2="90" y2="140" stroke="#000000" stroke-width="2.5"/>
          <line x1="60" y1="80" x2="80" y2="80" stroke="#000000" stroke-width="2.5"/>
          <!-- Fronds -->
          <path d="M 60,40 Q 10,20 -40,50 Q 0,80 60,40 Z" fill="#FFFFFF" stroke="#000000" stroke-width="3.5"/>
          <path d="M 60,40 Q 30,-20 -20,-30 Q 10,10 60,40 Z" fill="#FFFFFF" stroke="#000000" stroke-width="3.5"/>
          <path d="M 60,40 Q 80,-30 110,-20 Q 90,10 60,40 Z" fill="#FFFFFF" stroke="#000000" stroke-width="3.5"/>
          <path d="M 60,40 Q 110,10 140,50 Q 90,65 60,40 Z" fill="#FFFFFF" stroke="#000000" stroke-width="3.5"/>
          <!-- Coconuts -->
          <circle cx="50" cy="50" r="10" fill="#FFFFFF" stroke="#000000" stroke-width="3"/>
          <circle cx="68" cy="55" r="10" fill="#FFFFFF" stroke="#000000" stroke-width="3"/>
        </g>

        <!-- Cozy Beach Campfire in Center -->
        <g id="campfire" transform="translate(350, 520)">
          <!-- Crossed logs -->
          <polygon points="10,130 90,100 95,115 15,145" fill="#FFFFFF" stroke="#000000" stroke-width="3.5"/>
          <polygon points="10,105 85,140 75,152 0,118" fill="#FFFFFF" stroke="#000000" stroke-width="3.5"/>
          <!-- Big dancing flames -->
          <path d="M 30,110 Q 10,70 45,30 Q 30,65 55,20 Q 75,60 65,95 Q 85,75 80,110 Z" fill="#FFFFFF" stroke="#000000" stroke-width="4"/>
          <!-- Inner flame -->
          <path d="M 40,105 Q 35,80 50,55 Q 60,75 58,105 Z" fill="#FFFFFF" stroke="#000000" stroke-width="3"/>
          <!-- Spark bubbles -->
          <circle cx="48" cy="8" r="3" fill="#000000"/>
          <circle cx="62" cy="-10" r="4" fill="#000000"/>
          <circle cx="35" cy="-25" r="3" fill="#000000"/>
        </g>

        <!-- Marshmallow Roasting Sticks -->
        <g id="roasting" transform="translate(240, 510)">
          <line x1="0" y1="120" x2="120" y2="70" stroke="#000000" stroke-width="4"/>
          <!-- Marshmallow -->
          <rect x="100" y="60" width="22" height="18" rx="5" fill="#FFFFFF" stroke="#000000" stroke-width="3"/>
        </g>
        <g id="roasting2" transform="translate(450, 510)">
          <line x1="120" y1="130" x2="10" y2="70" stroke="#000000" stroke-width="4"/>
          <rect x="15" y="62" width="22" height="18" rx="5" fill="#FFFFFF" stroke="#000000" stroke-width="3"/>
        </g>

        <!-- Kids sitting around fire in silhouettes/outlines -->
        <g id="campfire-kid1" transform="translate(190, 580)">
          <circle cx="40" cy="40" r="22" fill="#FFFFFF" stroke="#000000" stroke-width="3.5"/>
          <circle cx="46" cy="38" r="3" fill="#000000"/>
          <path d="M 42,48 Q 48,54 54,48" stroke="#000000" stroke-width="2.5" fill="none"/>
          <path d="M 20,62 L 55,62 L 65,115 L 10,115 Z" fill="#FFFFFF" stroke="#000000" stroke-width="3.5"/>
        </g>
        <g id="campfire-kid2" transform="translate(520, 580)">
          <circle cx="30" cy="40" r="22" fill="#FFFFFF" stroke="#000000" stroke-width="3.5"/>
          <circle cx="24" cy="38" r="3" fill="#000000"/>
          <path d="M 20,48 Q 26,54 32,48" stroke="#000000" stroke-width="2.5" fill="none"/>
          <path d="M 15,62 L 50,62 L 60,115 L 5,115 Z" fill="#FFFFFF" stroke="#000000" stroke-width="3.5"/>
        </g>

        <!-- Postcard Stamp in Bottom Corner -->
        <g id="stamp" transform="translate(620, 720)">
          <rect x="0" y="0" width="110" height="90" fill="#FFFFFF" stroke="#000000" stroke-width="3" stroke-dasharray="6 4"/>
          <circle cx="55" cy="45" r="25" fill="#FFFFFF" stroke="#000000" stroke-width="2.5"/>
          <text x="55" y="42" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle" fill="#000000">REFRACT</text>
          <text x="55" y="56" font-family="sans-serif" font-size="10" text-anchor="middle" fill="#000000">OFFICIAL</text>
        </g>
      `;
      break;
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1050" width="800" height="1050" style="background:#FFFFFF;">
  <defs>
    <style>
      .outline { fill: #FFFFFF; stroke: #000000; stroke-width: 4; stroke-linejoin: round; stroke-linecap: round; }
      .thin-outline { fill: none; stroke: #000000; stroke-width: 2.5; stroke-linecap: round; }
      .dashed { stroke-dasharray: 6 5; }
      .book-title { font-family: 'Helvetica Neue', Arial, sans-serif; font-weight: 800; }
    </style>
  </defs>

  <!-- Crisp Printable Border & Margins -->
  <rect x="25" y="25" width="750" height="1000" rx="16" fill="#FFFFFF" stroke="#000000" stroke-width="6"/>
  <rect x="35" y="35" width="730" height="980" rx="10" fill="none" stroke="#000000" stroke-width="2" stroke-dasharray="8 6"/>

  <!-- Top Page Header -->
  <g transform="translate(50, 55)">
    <text x="0" y="22" font-family="sans-serif" font-size="13" font-weight="bold" fill="#000000" letter-spacing="2">REFRACT KIDS' COLORING STUDIO</text>
    <text x="700" y="22" font-family="sans-serif" font-size="13" font-weight="bold" fill="#000000" text-anchor="end">PAGE ${variantIndex} OF 4</text>
    <line x1="0" y1="32" x2="700" y2="32" stroke="#000000" stroke-width="2"/>
  </g>

  <!-- Main Scene Artwork -->
  <g id="coloring-scene">
    ${sceneContent}
  </g>

  <!-- Bottom Label Banner -->
  <g transform="translate(50, 930)">
    <line x1="0" y1="0" x2="700" y2="0" stroke="#000000" stroke-width="2"/>
    <rect x="0" y="10" width="700" height="55" rx="8" fill="#FFFFFF" stroke="#000000" stroke-width="3"/>
    <text x="20" y="36" font-family="sans-serif" font-size="18" font-weight="800" fill="#000000">PAGE ${variantIndex}: ${pageTitle.toUpperCase()}</text>
    <text x="20" y="54" font-family="sans-serif" font-size="12" fill="#000000">${subtitle || `${setting} Vacation Memory • Pure B&amp;W Color-Ready Illustration`}</text>
    <text x="680" y="44" font-family="monospace" font-size="11" font-weight="bold" text-anchor="end" fill="#000000">#000000 / #FFFFFF</text>
  </g>
</svg>`;
}

export function svgToDataUrl(svgString: string): string {
  // Use base64 encoding for clean data url
  if (typeof window !== "undefined") {
    return `data:image/svg+xml;base64,${window.btoa(unescape(encodeURIComponent(svgString)))}`;
  }
  return `data:image/svg+xml;base64,${Buffer.from(svgString).toString("base64")}`;
}

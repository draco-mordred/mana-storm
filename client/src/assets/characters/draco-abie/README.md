# Draco Abie (Abielle) - Mana Storm Character

## Character Profile

- **Full Name**: Draco Abie (Abielle)
- **Class**: Marksman
- **Nickname**: Gale Huntress
- **Age**: 20 years old
- **Height**: 168 cm
- **Build**: Athletic
- **Hair**: Short chestnut-brown
- **Eyes**: Warm brown
- **Relation**: Twin sister of Draco Noir (older by 6 minutes)

## Appearance

### Outfit
- White field shirt
- Brown leather corset
- Split long ranger coat
- Tactical shorts
- Leather utility belt
- High leather boots

### Equipment
- **Primary**: Stormcaller Bow
- **Secondary**: Zephyr & Tempest Daggers

## Mana Affinities

- Wind: Master (Level 5)
- Lightning: Master (Level 5)
- Water: Advanced (Level 4)

## Skills

### Basic Skills
1. Gale Arrow - Fires an arrow imbued with wind magic, piercing through enemies
2. Thunder Fang - Unleashes a lightning-infused arrow that chains between targets
3. Sky Piercer - Fires a high-velocity arrow that rains down from the sky
4. Tempest Volley - Rapidly fires multiple wind arrows in a cone
5. Cyclone Shot - Creates a swirling wind vortex that damages enemies in area
6. Storm Rain - Calls down a rain of arrows from the storm clouds

### Utility Skills
7. Falcon Dive - Leaps backward while firing a precise shot
8. Gale Dance - Quickly dodges to the side with wind assistance
9. Phantom Step - Briefly becomes intangible and moves quickly

### Advanced Skills
10. Lightning Cross - Fires two lightning arrows in a cross pattern
11. Storm Waltz - Performs a spinning attack with daggers

## Ultimate Techniques (To Be Implemented)

- Tempest Dominion - Summons a massive storm that ravages the battlefield
- Heaven's Thunder - Calls down divine lightning upon enemies
- Horizon Breaker - Fires an arrow that shatters the horizon itself

## Asset Files

This directory should contain the following character sheet images:

1. draco-abie-full-sheet.png - Full character sheet with equipment (front, back, left, right views)
2. draco-abie-equipment.png - Equipment breakdown (leather corset, shoulder harness, utility belt, thigh strap, quiver)
3. draco-abie-body-reference.png - Body reference (undergarments, all views)
4. draco-abie-multi-view.png - Simplified multi-view character sheet

## Integration Notes

- Character preset is defined in client/src/utils/constants.ts
- Character selection is available in client/src/components/MainMenu.tsx
- Character rendering uses the HonkaiCharacter component in client/src/components/GameScene.tsx
- Character type: dracoAbie
- Model: dracoAbie (3D model to be created)
- Color: 0x8b4513 (saddle brown)

## Status

- Character preset added to constants.ts
- Skills defined in SKILLS database
- Character selection integrated in MainMenu.tsx
- Ranger coat outfit support added to GameScene.tsx
- Character type prop added to GameScene
- Character images pending upload
- 3D model not yet created
- Ultimate techniques not yet implemented
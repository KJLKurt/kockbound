export const CHARACTERS={sprout:{name:'Sprout',path:'character.sprout-prototype/r003'},lumi:{name:'Lumi',path:'character.lumi-prototype/r002'},pebble:{name:'Pebble',path:'character.pebble/r001'},wisp:{name:'Wisp',path:'character.wisp/r001'}} as const;
export type Appearance=keyof typeof CHARACTERS;
export const SKINS={classic:{name:'Classic',hue:null},sunset:{name:'Sunset',hue:.035},mint:{name:'Mint',hue:.43},violet:{name:'Violet',hue:.77}} as const;
export type Skin=keyof typeof SKINS;
export const validAppearance=(v:unknown):v is Appearance=>typeof v==='string'&&Object.hasOwn(CHARACTERS,v);
export const validSkin=(v:unknown):v is Skin=>typeof v==='string'&&Object.hasOwn(SKINS,v);

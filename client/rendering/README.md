# client/rendering

Three.js presentation, cameras, animation, VFX and asset preview. Read snapshots/events; never decide hits or outcomes.

M1 development presentation in `arena-view.ts`: original code-authored Sky Ring/cloud scenery and existing Sprout/Lumi GLBs, interpolation, animation crossfades, particles and ground/name markers. Art is explicitly prototype quality. No collision or outcome is decided here.

M3 world pass: `sky-ring.ts` owns original paved/crown floor texture, blue/gold island geometry, instanced clouds and distant architecture/waterfalls. Camera aspect adjustment is continuous. Warning rim has independent material and an outer band; reduced motion disables the band pulse/cloud drift. See tests/evidence/M3-world for actual visual checks and pending gates. The support disk remains defined exclusively by shared simulation.

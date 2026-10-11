//Test code blah blah
/*
==========================TODO==========================
Priority:

 1. Sprites (rendering images instead of simple shapes)

   - Further develop Renderer to support this (and custom drawing functions in general)

   - Sprite component for game objects

   - Scene backgrounds
 

2. Physics Component 
  
   - rather than have simulation logic live in this component, run a physics simulation in the engine loop (or in seperate sim)
     and have the components read/write to it 
    
   - Object velocities & acceleration

   - Gravity, air resistcance, friction(materials?)


 3. Camera

   - Camera determines what gets sent to the renderer & where

   - User Interface: 

   - Menu's & text (maybe draw component should also have text capabilities or an individual text component for non-ui text)

   - graphic component rendered at the closest layer

   - requires a camera component on the object

 
 4. Animation system (frame-based animations, tweening, etc.)

   - Sprite animations

   - Scene transitions

   - Tweens????


 5. Audio management (playing sounds, music, etc.)

    - Audio Component for game objects

    - Background music support in Scene

    - AudioManager in engine for handling audio playback, volume control, etc.

  
 


 =========================BUGS============================


=========================OPTIMIZATIONS========================
 - WebGL rendering (shaders, textures, sprites, etc.)
   - Potentially use to send graphics data to GPU for more efficient rendering, even for simple shapes & 
     sprites

*/
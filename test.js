//Test code blah blah
/*
==========================TODO==========================
Priority:
 1. Script Component (for custom behavior)


 2. Further develop hitboxes

   - Figure our how to configure event functions. (Maybe from a script component?)

   - Multiple hitboxes per object

   - Add tags to hitboxes for more specific collision handling


 3. Physics Component 
  
   - rather than have simulation logic live in this component, run a physics simulation in the engine loop (or in seperate sim)
     and have the components read/write to it 
     
 
 4. Sprite Component (rendering images instead of simple shapes)

   - Asset management system for loading and managing sprites

   - Further develop Renderer to support this (and custom drawing functions in general)


 5. Animation system (frame-based animations, tweening, etc.)

 
 6. Scene management (scene transitions)


 7. Audio management (playing sounds, music, etc.)


 8. WebGL rendering (shaders, textures, sprites, etc.)
   - Potentially use to send graphics data to GPU for more efficient rendering, even for simple shapes & 
     sprites

  
 


 =========================BUGS============================
  - Inputs not clearing from keyRelease, causing player to keep moving after key is released sometimes


=========================OPTIMIZATIONS========================
 
*/
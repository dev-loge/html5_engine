//Test code blah blah
/*
==========================TODO==========================
Priority:
 1. Change how Scenes are stored and registered in the Engine

   - Instead of storing scenes as subclasses, store them as json's that get passed to the scene class.

   - Do something similar for templates & GameObject class,

 2. Further develop hitboxes

   - Add tags to hitboxes for more specific collision handling


 3. Sprite Component (rendering images instead of simple shapes)

   - Asset management system for loading and managing sprites

   - Further develop Renderer to support this (and custom drawing functions in general)

 
 4. Animation system (frame-based animations, tweening, etc.)

 
 5. Scene management (scene transitions)

 6. Audio management (playing sounds, music, etc.)


 7. WebGL rendering (shaders, textures, sprites, etc.)
   - Potentially use to send graphics data to GPU for more efficient rendering, even for simple shapes & 
     sprites

=========================BUGS============================
  - Inputs not clearing from keyRelease, causing player to keep moving after key is released sometimes


=========================OPTIMIZATIONS========================
 - engine is passed to all subclasses, causing it to be saved within itself several times
   Instead, objects & components should look upstream to find the engine class in the scene. (may have to pipeline that data downstream)
*/
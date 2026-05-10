//Test code blah blah
/*
==========================TODO==========================
Priority:
 1. Change how GameObjects are created and handled 

   - Instead of creating game objects directly in the scene constructor, 
     create a separate method for setting up the scene (e.g. setupScene) that is 
     called when the scene is switched to. This allows for better organization and easier resetting of 
     scenes.

   - Add a way to easily reference and manipulate game objects in the scene 
     (e.g. by giving them unique IDs or tags)
   
   - GameObject destruction and cleanup when switching scenes
     (GameObjects should have a destroy method that removes them from the scene and cleans up any 
     references to them)

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

*/
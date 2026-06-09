//Test code blah blah
/*
==========================TODO==========================
Priority:
 0. Parent & Children GameObjects

   - Refactor Coordinates project wide?

   - (0,0) is currently considered the top-left of the object, would rather it be the center (Consider similar changes for canvas)

   - Game objects can have other objects as parents. Their position will be relative to their parent's.


 1. Sprites (rendering images instead of simple shapes)

   - Further develop Renderer to support this (and custom drawing functions in general)

   - Sprite component for game objects

   - Scene backgrounds
 

2. Physics Component 
  
   - rather than have simulation logic live in this component, run a physics simulation in the engine loop (or in seperate sim)
     and have the components read/write to it 
    
   - Object velocities & acceleration

   - Gravity, air resistcance, friction(materials?)
     
 
3. Rendering Layers

   - layer value on all graphic components

   - scene has background always at the farthest layer

   - UI components always at the closest layer


 4. Camera & UI Components

   - Camera determines what gets sent to the renderer & where

   - User Interface: 

   - Menu's & text (maybe draw component should also have text capabilities or an individual text component for non-ui text)

   - graphic component rendered at the closest layer

   - requires a camera component on the object

 
 5. Animation system (frame-based animations, tweening, etc.)

   - Sprite animations

   - Scene transitions

   - Tweens????


 6. Audio management (playing sounds, music, etc.)

    - Audio Component for game objects

    - Background music support in Scene

    - AudioManager in engine for handling audio playback, volume control, etc.

  
 


 =========================BUGS============================
 - Scenes retain their game objects and state when switching away and back to them. 
   (This can be used to create persistent objects across scenes, but may cause unintended side effects if not expected. 
   Consider adding an option to reset scene state when switching back to it.)

 - Empty gameobject when changing scene?

=========================OPTIMIZATIONS========================
 - add a heler lib somewhere to help with data validation project wide

 - WebGL rendering (shaders, textures, sprites, etc.)
   - Potentially use to send graphics data to GPU for more efficient rendering, even for simple shapes & 
     sprites

*/
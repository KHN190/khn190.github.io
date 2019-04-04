---
layout: post
title:  "Tutorial - Change Unity Tile's Sprite During Runtime"
cover: null.png
date:   2019-04-06 00:00:00 +0800
categories: game-design
---

There are 2 ways to **change a tile's sprite** during runtime:

1. Change tiles in a tilemap to a new tile ([SetTiles][1] or [SwapTile][2])
2. Change tile's sprite

Both solution requires **re-rendering** of tiles. 

This is why simply setting `tile.sprite` to a new sprite is not enough. I'll explain it later.

---

Tile is only a reference to some attributes. Tilemap reuses the attributes instead of creating multiple game objects to save memory space. Tiles implement some interfaces to be called in Tilemap, which the latter one stores a grid of information and renders them.

This is important because if you want to customize your tiles - this should be put into Unity's docs - in most cases, you **do not call them directly** on `CustomizedTile : Tile` like MonoBehaviour classes. You need to implement the interfaces which is used by Tilemap, and call Tilemap's methods.

So, there are two important interfaces: **[GetTileData][3]** and **[RefreshTile][4]**.

As mentioned in docs, `GetTileData` sets all necessary data for rendering a tile. But the render process is also controlled by `RefreshTile`. It's a bit weird that `TileBase` doesn't implement them by itself, so you have to implement them in your own customized Tile. It's also a bit weird they are not `interface` - like Unity UI's callbacks.

But here finally comes the solution:

```csharp
// Set sprite for rendering
public override void GetTileData(Vector3Int position, ITilemap tilemap, ref TileData tileData)
{
  if (sprites != null && sprites.Length > 0)
  {
    tileData.sprite = sprites[spriteIndex];
  }
}

// Refresh yourself
public override void RefreshTile(Vector3Int position, ITilemap tilemap) 
{
  tilemap.RefreshTile(position);
}
```

Now you can change the sprite outside Tile and Tilemap and refresh them. I have:

```csharp
// loop all tiles in Tilemap
BoundsInt bounds = tilemap.cellBounds;

bool updated = false;

foreach (Vector3Int pos in bounds.allPositionsWithin) 
{
  TileBase tile = tilemap.GetTile(pos);
  if (tile && tile is SwitchableTile)
  {
    if (!updated) 
    {
      // just loop index
      Sprite sprite = ((SwitchableTile)tile).GetNextSprite();
      // set sprite, only once!
      ((SwitchableTile)tile).sprite = sprite;

      updated = true;
    }
    // refresh
    tilemap.RefreshTile(pos);
  }
}
``` 

Note the first two options (SetTiles and SwapTile) by Unity automatically calls refresh so you don't have to manually do this.

  [1]: https://docs.unity3d.com/ScriptReference/Tilemaps.Tilemap.SetTiles.html
  [2]: https://docs.unity3d.com/ScriptReference/Tilemaps.Tilemap.SwapTile.html
  [3]: https://docs.unity3d.com/ScriptReference/Tilemaps.TileBase.GetTileData.html
  [4]: https://docs.unity3d.com/ScriptReference/Tilemaps.TileBase.RefreshTile.html
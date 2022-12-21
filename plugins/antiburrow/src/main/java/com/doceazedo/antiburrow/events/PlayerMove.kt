package com.doceazedo.antiburrow.events

import org.bukkit.Material
import org.bukkit.event.EventHandler
import org.bukkit.event.Listener
import org.bukkit.event.player.PlayerMoveEvent

object PlayerMove : Listener {
    @EventHandler
    fun onPlayerMove(e: PlayerMoveEvent) {
        val location = e.player.location
        val block = location.block
        if (block.type == Material.AIR) return

        val heightThreshold = location.block.y + 0.1
        if (block.type.isOccluding || (block.type.isSolid && location.y < heightThreshold)) {
            e.player.teleport(location.add(0.0, 1.0, 0.0))
        }
    }
}

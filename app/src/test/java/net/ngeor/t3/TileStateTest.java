package net.ngeor.t3;

import org.junit.Test;

import static org.junit.Assert.assertEquals;

/**
 * Created by ngeor on 2/4/2017.
 */
public class TileStateTest {
    @Test
    public void shouldCreateFromPlayerX() {
        assertEquals(TileState.X, TileState.fromPlayer(Player.X));
    }

    @Test
    public void shouldCreateFromPlayerO() {
        assertEquals(TileState.O, TileState.fromPlayer(Player.O));
    }
}

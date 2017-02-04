package net.ngeor.t3;

import org.junit.Test;

import static org.junit.Assert.assertEquals;

/**
 * Created by ngeor on 2/4/2017.
 */
public class PlayerTest {
    @Test
    public void opponentOfXShouldBeO() {
        assertEquals(Player.O, Player.X.opponent());
    }

    @Test
    public void opponentOfOShouldBeX() {
        assertEquals(Player.X, Player.O.opponent());
    }
}

package net.ngeor.t3.models;

import org.junit.Test;

import static org.junit.Assert.assertEquals;

/**
 * Created by ngeor on 2/4/2017.
 */
public class PlayerSymbolTest {
    @Test
    public void opponentOfXShouldBeO() {
        assertEquals(PlayerSymbol.O, PlayerSymbol.X.opponent());
    }

    @Test
    public void opponentOfOShouldBeX() {
        assertEquals(PlayerSymbol.X, PlayerSymbol.O.opponent());
    }
}

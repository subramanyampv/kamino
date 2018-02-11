package net.ngeor.t3.preferences;

import org.junit.Test;

import static org.junit.Assert.assertEquals;

/**
 * Unit tests for PlayerName.
 *
 * @author ngeor on 11/2/2018.
 */
public class PlayerNameTest {
    @Test
    public void otherOfFirstIsSecond() throws Exception {
        assertEquals(PlayerName.second, PlayerName.first.other());
    }

    @Test
    public void otherOfSecondIsFirst() throws Exception {
        assertEquals(PlayerName.first, PlayerName.second.other());
    }
}
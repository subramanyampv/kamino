package net.ngeor.t3.settings;

import net.ngeor.t3.models.AILevel;
import net.ngeor.t3.models.PlayerSymbol;

import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotEquals;

/**
 * Unit tests for HumanPlayerDefinition.
 *
 * @author ngeor on 11/2/2018.
 */
public class HumanPlayerDefinitionTest {
    @Test(expected = IllegalArgumentException.class)
    public void playerSymbolCannotBeNull() {
        new HumanPlayerDefinition(null);
    }

    @Test
    public void testToString() throws Exception {
        HumanPlayerDefinition definition = new HumanPlayerDefinition(PlayerSymbol.O);
        assertEquals("HumanPlayerDefinition {O}", definition.toString());
    }

    @Test
    public void testEquals() throws Exception {
        HumanPlayerDefinition a = new HumanPlayerDefinition(PlayerSymbol.X);
        HumanPlayerDefinition b = new HumanPlayerDefinition(PlayerSymbol.X);
        assertEquals(a, b);
    }

    @Test
    public void testNotEquals() throws Exception {
        HumanPlayerDefinition a = new HumanPlayerDefinition(PlayerSymbol.X);
        HumanPlayerDefinition b = new HumanPlayerDefinition(PlayerSymbol.O);
        assertNotEquals(a, b);
    }

    @Test
    public void testNullNotEquals() {
        HumanPlayerDefinition a = new HumanPlayerDefinition(PlayerSymbol.X);
        assertNotEquals(a, null);
    }

    @Test
    public void testDifferentImplNotEquals() {
        HumanPlayerDefinition a = new HumanPlayerDefinition(PlayerSymbol.X);
        AIPlayerDefinition b = new AIPlayerDefinition(PlayerSymbol.X, AILevel.EASY);
        assertNotEquals(a, b);
    }

    @Test
    public void testHashCode() throws Exception {
        HumanPlayerDefinition a = new HumanPlayerDefinition(PlayerSymbol.X);
        HumanPlayerDefinition b = new HumanPlayerDefinition(PlayerSymbol.X);
        assertEquals(a.hashCode(), b.hashCode());
    }

    @Test
    public void getPlayerSymbol() throws Exception {
        HumanPlayerDefinition x = new HumanPlayerDefinition(PlayerSymbol.X);
        assertEquals(PlayerSymbol.X, x.getPlayerSymbol());
    }
}
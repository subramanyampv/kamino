package net.ngeor.t3.settings;

import net.ngeor.t3.models.AILevel;
import net.ngeor.t3.models.PlayerSymbol;

import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotEquals;

/**
 * Unit test for AIPlayerDefinition.
 *
 * @author ngeor on 11/2/2018.
 */
public class AIPlayerDefinitionTest {
    @Test(expected = IllegalArgumentException.class)
    public void playerSymbolCannotBeNull() {
        new AIPlayerDefinition(null, AILevel.EASY);
    }

    @Test(expected = IllegalArgumentException.class)
    public void aiLevelCannotBeNull() {
        new AIPlayerDefinition(PlayerSymbol.X, null);
    }

    @Test
    public void getAILevel() throws Exception {
        AIPlayerDefinition definition = new AIPlayerDefinition(PlayerSymbol.X, AILevel.EASY);
        assertEquals(AILevel.EASY, definition.getAILevel());
    }

    @Test
    public void testToString() throws Exception {
        AIPlayerDefinition definition = new AIPlayerDefinition(PlayerSymbol.X, AILevel.EASY);
        assertEquals("AIPlayerDefinition {X EASY}", definition.toString());
    }

    @Test
    public void testEquals() throws Exception {
        AIPlayerDefinition a = new AIPlayerDefinition(PlayerSymbol.X, AILevel.EASY);
        AIPlayerDefinition b = new AIPlayerDefinition(PlayerSymbol.X, AILevel.EASY);
        assertEquals(a, b);
    }

    @Test
    public void testNullNotEquals() {
        AIPlayerDefinition a = new AIPlayerDefinition(PlayerSymbol.X, AILevel.EASY);
        assertNotEquals(a, null);
    }

    @Test
    public void testDifferentSymbolNotEquals() throws Exception {
        AIPlayerDefinition a = new AIPlayerDefinition(PlayerSymbol.X, AILevel.EASY);
        AIPlayerDefinition b = new AIPlayerDefinition(PlayerSymbol.O, AILevel.EASY);
        assertNotEquals(a, b);
    }

    @Test
    public void testDifferentAILevelNotEquals() throws Exception {
        AIPlayerDefinition a = new AIPlayerDefinition(PlayerSymbol.X, AILevel.EASY);
        AIPlayerDefinition b = new AIPlayerDefinition(PlayerSymbol.X, AILevel.MEDIUM);
        assertNotEquals(a, b);
    }

    @Test
    public void testDifferentImplNotEquals() {
        AIPlayerDefinition a = new AIPlayerDefinition(PlayerSymbol.X, AILevel.EASY);
        HumanPlayerDefinition b = new HumanPlayerDefinition(PlayerSymbol.X);
        assertNotEquals(a, b);
    }

    @Test
    public void testHashCode() throws Exception {
        AIPlayerDefinition a = new AIPlayerDefinition(PlayerSymbol.X, AILevel.EASY);
        AIPlayerDefinition b = new AIPlayerDefinition(PlayerSymbol.X, AILevel.EASY);
        assertEquals(a.hashCode(), b.hashCode());
    }

    @Test
    public void getPlayerSymbol() throws Exception {
        AIPlayerDefinition definition = new AIPlayerDefinition(PlayerSymbol.X, AILevel.EASY);
        assertEquals(PlayerSymbol.X, definition.getPlayerSymbol());
    }
}
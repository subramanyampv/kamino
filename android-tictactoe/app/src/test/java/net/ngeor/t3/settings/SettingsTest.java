package net.ngeor.t3.settings;

import net.ngeor.t3.models.AILevel;
import net.ngeor.t3.models.PlayerSymbol;

import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotEquals;
import static org.junit.Assert.assertTrue;

/**
 * Unit tests for Settings.
 *
 * @author ngeor on 2/11/2017.
 */
public class SettingsTest {
    @Test
    public void create() {
        // arrange
        AIPlayerDefinition ai = new AIPlayerDefinition(PlayerSymbol.X, AILevel.MEDIUM);
        HumanPlayerDefinition human = new HumanPlayerDefinition(PlayerSymbol.O);

        // act
        Settings settings = new Settings(3, 4, false, new PlayerDefinitions(ai, human));

        // assert
        assertEquals(3, settings.getRows());
        assertEquals(4, settings.getCols());
        assertEquals(new PlayerDefinitions(ai, human), settings.getPlayerDefinitions());
        assertFalse(settings.isInvisibleMode());
    }

    @Test
    public void create_invisibleMode() {
        // arrange
        AIPlayerDefinition ai = new AIPlayerDefinition(PlayerSymbol.X, AILevel.MEDIUM);
        HumanPlayerDefinition human = new HumanPlayerDefinition(PlayerSymbol.O);

        // act
        Settings settings = new Settings(3, 3, true, new PlayerDefinitions(ai, human));

        // assert
        assertTrue(settings.isInvisibleMode());
    }

    @Test(expected = IllegalArgumentException.class)
    public void create_playerDefinitionsCannotBeNull() {
        new Settings(3, 3, false, null);
    }

    @Test
    public void testEquals() {
        AIPlayerDefinition ai = new AIPlayerDefinition(PlayerSymbol.X, AILevel.MEDIUM);
        HumanPlayerDefinition human = new HumanPlayerDefinition(PlayerSymbol.O);
        Settings settings1 = new Settings(3, 4, false, new PlayerDefinitions(ai, human));
        Settings settings2 = new Settings(3, 4, false, new PlayerDefinitions(ai, human));
        assertEquals(settings1, settings2);
    }

    @Test
    public void testHashCode() {
        AIPlayerDefinition ai = new AIPlayerDefinition(PlayerSymbol.X, AILevel.MEDIUM);
        HumanPlayerDefinition human = new HumanPlayerDefinition(PlayerSymbol.O);
        Settings settings1 = new Settings(3, 4, false, new PlayerDefinitions(ai, human));
        Settings settings2 = new Settings(3, 4, false, new PlayerDefinitions(ai, human));
        assertEquals(settings1.hashCode(), settings2.hashCode());
    }

    @Test
    public void testHashCode_differentInvisibleMode() {
        AIPlayerDefinition ai = new AIPlayerDefinition(PlayerSymbol.X, AILevel.MEDIUM);
        HumanPlayerDefinition human = new HumanPlayerDefinition(PlayerSymbol.O);
        Settings settings1 = new Settings(3, 4, false, new PlayerDefinitions(ai, human));
        Settings settings2 = new Settings(3, 4, true, new PlayerDefinitions(ai, human));
        assertNotEquals(settings1.hashCode(), settings2.hashCode());
    }

    @Test
    public void testNotEquals_Null() {
        AIPlayerDefinition ai = new AIPlayerDefinition(PlayerSymbol.X, AILevel.MEDIUM);
        HumanPlayerDefinition human = new HumanPlayerDefinition(PlayerSymbol.O);
        Settings settings1 = new Settings(3, 4, false, new PlayerDefinitions(ai, human));
        assertNotEquals(settings1, null);
    }

    @Test
    public void testNotEquals_WrongType() {
        AIPlayerDefinition ai = new AIPlayerDefinition(PlayerSymbol.X, AILevel.MEDIUM);
        HumanPlayerDefinition human = new HumanPlayerDefinition(PlayerSymbol.O);
        Settings settings1 = new Settings(3, 4, false, new PlayerDefinitions(ai, human));
        assertNotEquals(settings1, ai);
    }

    @Test
    public void testNotEquals_differentRows() {
        AIPlayerDefinition ai = new AIPlayerDefinition(PlayerSymbol.X, AILevel.MEDIUM);
        HumanPlayerDefinition human = new HumanPlayerDefinition(PlayerSymbol.O);
        Settings settings1 = new Settings(3, 4, false, new PlayerDefinitions(ai, human));
        Settings settings2 = new Settings(4, 4, false, new PlayerDefinitions(ai, human));
        assertNotEquals(settings1, settings2);
    }

    @Test
    public void testNotEquals_differentCols() {
        AIPlayerDefinition ai = new AIPlayerDefinition(PlayerSymbol.X, AILevel.MEDIUM);
        HumanPlayerDefinition human = new HumanPlayerDefinition(PlayerSymbol.O);
        Settings settings1 = new Settings(3, 4, false, new PlayerDefinitions(ai, human));
        Settings settings2 = new Settings(3, 3, false, new PlayerDefinitions(ai, human));
        assertNotEquals(settings1, settings2);
    }

    @Test
    public void testNotEquals_differentInvisibleMode() {
        AIPlayerDefinition ai = new AIPlayerDefinition(PlayerSymbol.X, AILevel.MEDIUM);
        HumanPlayerDefinition human = new HumanPlayerDefinition(PlayerSymbol.O);
        Settings settings1 = new Settings(3, 3, false, new PlayerDefinitions(ai, human));
        Settings settings2 = new Settings(3, 3, true, new PlayerDefinitions(ai, human));
        assertNotEquals(settings1, settings2);
    }

    @Test
    public void testNotEquals_differentPlayerDefinitions() {
        AIPlayerDefinition ai = new AIPlayerDefinition(PlayerSymbol.X, AILevel.MEDIUM);
        HumanPlayerDefinition human = new HumanPlayerDefinition(PlayerSymbol.O);
        Settings settings1 = new Settings(3, 3, false, new PlayerDefinitions(ai, human));
        Settings settings2 = new Settings(3, 3, false, new PlayerDefinitions(human, ai));
        assertNotEquals(settings1, settings2);
    }
}
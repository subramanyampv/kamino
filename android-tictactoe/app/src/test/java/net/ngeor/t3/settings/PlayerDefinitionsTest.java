package net.ngeor.t3.settings;

import net.ngeor.t3.models.AILevel;
import net.ngeor.t3.models.PlayerSymbol;

import org.junit.Test;

import java.util.Arrays;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotEquals;

/**
 * Unit tests for PlayerDefinitions.
 *
 * @author ngeor on 11/2/2018.
 */
public class PlayerDefinitionsTest {
    @Test
    public void create() {
        HumanPlayerDefinition firstPlayerDefinition = new HumanPlayerDefinition(PlayerSymbol.X);
        AIPlayerDefinition secondPlayerDefinition = new AIPlayerDefinition(PlayerSymbol.O, AILevel.EASY);
        PlayerDefinitions playerDefinitions = new PlayerDefinitions(
                firstPlayerDefinition,
                secondPlayerDefinition
        );

        assertEquals(firstPlayerDefinition, playerDefinitions.getFirstPlayerDefinition());
        assertEquals(secondPlayerDefinition, playerDefinitions.getSecondPlayerDefinition());
    }

    @Test(expected = IllegalArgumentException.class)
    public void create_firstPlayerDefinitionCannotBeNull() {
        new PlayerDefinitions(null, new AIPlayerDefinition(PlayerSymbol.O, AILevel.EASY));
    }

    @Test(expected = IllegalArgumentException.class)
    public void create_secondPlayerDefinitionCannotBeNull() {
        new PlayerDefinitions(new HumanPlayerDefinition(PlayerSymbol.X), null);
    }

    @Test(expected = IllegalArgumentException.class)
    public void create_playersCannotBeEqual() {
        new PlayerDefinitions(
                new HumanPlayerDefinition(PlayerSymbol.X),
                new HumanPlayerDefinition(PlayerSymbol.X)
        );
    }

    @Test(expected = IllegalArgumentException.class)
    public void create_playerSymbolsCannotBeEqual() {
        new PlayerDefinitions(
                new HumanPlayerDefinition(PlayerSymbol.X),
                new AIPlayerDefinition(PlayerSymbol.X, AILevel.EASY)
        );
    }

    @Test
    public void getByPlayerSymbol_firstPlayer() {
        HumanPlayerDefinition firstPlayerDefinition = new HumanPlayerDefinition(PlayerSymbol.X);
        AIPlayerDefinition secondPlayerDefinition = new AIPlayerDefinition(PlayerSymbol.O, AILevel.EASY);
        PlayerDefinitions playerDefinitions = new PlayerDefinitions(
                firstPlayerDefinition,
                secondPlayerDefinition
        );

        // act
        PlayerDefinition playerDefinition = playerDefinitions.get(PlayerSymbol.X);

        // assert
        assertEquals(firstPlayerDefinition, playerDefinition);
    }

    @Test
    public void getByPlayerSymbol_secondPlayer() {
        HumanPlayerDefinition firstPlayerDefinition = new HumanPlayerDefinition(PlayerSymbol.X);
        AIPlayerDefinition secondPlayerDefinition = new AIPlayerDefinition(PlayerSymbol.O, AILevel.EASY);
        PlayerDefinitions playerDefinitions = new PlayerDefinitions(
                firstPlayerDefinition,
                secondPlayerDefinition
        );

        // act
        PlayerDefinition playerDefinition = playerDefinitions.get(PlayerSymbol.O);

        // assert
        assertEquals(secondPlayerDefinition, playerDefinition);
    }

    @Test(expected = IllegalArgumentException.class)
    public void getByPlayerSymbol_playerSymbolCannotBeNull() {
        HumanPlayerDefinition firstPlayerDefinition = new HumanPlayerDefinition(PlayerSymbol.X);
        AIPlayerDefinition secondPlayerDefinition = new AIPlayerDefinition(PlayerSymbol.O, AILevel.EASY);
        PlayerDefinitions playerDefinitions = new PlayerDefinitions(
                firstPlayerDefinition,
                secondPlayerDefinition
        );

        // act
        playerDefinitions.get(null);
    }

    @Test
    public void testEquals() {
        HumanPlayerDefinition firstPlayerDefinition = new HumanPlayerDefinition(PlayerSymbol.X);
        AIPlayerDefinition secondPlayerDefinition = new AIPlayerDefinition(PlayerSymbol.O, AILevel.EASY);
        PlayerDefinitions a = new PlayerDefinitions(
                firstPlayerDefinition,
                secondPlayerDefinition
        );
        PlayerDefinitions b = new PlayerDefinitions(
                firstPlayerDefinition,
                secondPlayerDefinition
        );
        assertEquals(a, b);
    }

    @Test
    public void testNotEquals_Null() {
        HumanPlayerDefinition firstPlayerDefinition = new HumanPlayerDefinition(PlayerSymbol.X);
        AIPlayerDefinition secondPlayerDefinition = new AIPlayerDefinition(PlayerSymbol.O, AILevel.EASY);
        PlayerDefinitions a = new PlayerDefinitions(
                firstPlayerDefinition,
                secondPlayerDefinition
        );
        assertNotEquals(a, null);
    }

    @Test
    public void testNotEquals_DifferentType() {
        HumanPlayerDefinition firstPlayerDefinition = new HumanPlayerDefinition(PlayerSymbol.X);
        AIPlayerDefinition secondPlayerDefinition = new AIPlayerDefinition(PlayerSymbol.O, AILevel.EASY);
        PlayerDefinitions a = new PlayerDefinitions(
                firstPlayerDefinition,
                secondPlayerDefinition
        );
        assertNotEquals(a, Arrays.asList(firstPlayerDefinition, secondPlayerDefinition));
    }

    @Test
    public void testNotEquals_FirstIsDifferent() {
        HumanPlayerDefinition firstPlayerDefinition = new HumanPlayerDefinition(PlayerSymbol.X);
        AIPlayerDefinition secondPlayerDefinition = new AIPlayerDefinition(PlayerSymbol.O, AILevel.EASY);
        PlayerDefinitions a = new PlayerDefinitions(
                firstPlayerDefinition,
                secondPlayerDefinition
        );
        PlayerDefinitions b = new PlayerDefinitions(
                secondPlayerDefinition,
                firstPlayerDefinition
        );

        assertNotEquals(a, b);
    }

    @Test
    public void testNotEquals_SecondIsDifferent() {
        HumanPlayerDefinition firstPlayerDefinition = new HumanPlayerDefinition(PlayerSymbol.X);
        AIPlayerDefinition secondPlayerDefinition = new AIPlayerDefinition(PlayerSymbol.O, AILevel.EASY);
        AIPlayerDefinition secondPlayerDefinitionMedium = new AIPlayerDefinition(PlayerSymbol.O, AILevel.MEDIUM);
        PlayerDefinitions a = new PlayerDefinitions(
                firstPlayerDefinition,
                secondPlayerDefinition
        );
        PlayerDefinitions b = new PlayerDefinitions(
                firstPlayerDefinition,
                secondPlayerDefinitionMedium
        );

        assertNotEquals(a, b);
    }

    @Test
    public void testHashCode() {
        HumanPlayerDefinition firstPlayerDefinition = new HumanPlayerDefinition(PlayerSymbol.X);
        AIPlayerDefinition secondPlayerDefinition = new AIPlayerDefinition(PlayerSymbol.O, AILevel.EASY);
        PlayerDefinitions a = new PlayerDefinitions(
                firstPlayerDefinition,
                secondPlayerDefinition
        );
        PlayerDefinitions b = new PlayerDefinitions(
                firstPlayerDefinition,
                secondPlayerDefinition
        );

        assertEquals(a.hashCode(), b.hashCode());
    }
}

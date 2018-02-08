package net.ngeor.t3.ai;

import net.ngeor.t3.models.AILevel;
import net.ngeor.t3.models.GameModel;
import net.ngeor.t3.models.Location;
import net.ngeor.t3.models.PlayerSymbol;
import net.ngeor.t3.settings.PlayerDefinition;
import net.ngeor.t3.settings.Settings;
import net.ngeor.t3.settings.serializable.AIPlayerDefinitionImpl;
import net.ngeor.t3.settings.serializable.HumanPlayerDefinitionImpl;
import net.ngeor.t3.settings.serializable.SettingsImpl;
import org.junit.Before;
import org.junit.Test;

import java.util.List;

import static org.junit.Assert.assertArrayEquals;
import static org.mockito.Mockito.mock;

/**
 * Unit test for SmartMove.
 * Created by ngeor on 2/6/2017.
 */
public class SmartMoveTest {
    private GameModel model;
    private MessageBox messageBox;

    @Before
    public void before() {
        PlayerDefinition first = new HumanPlayerDefinitionImpl(PlayerSymbol.X);
        PlayerDefinition second = new AIPlayerDefinitionImpl(PlayerSymbol.O, AILevel.EASY);
        Settings settings = new SettingsImpl(3, 3, first, second);
        model = new GameModel(settings);
        messageBox = mock(MessageBox.class);
    }

    /**
     * This test proves the CPU will block this scenario.
     * Next move is CPU, CPU plays with O:
     *
     * x| |X
     * O|X|
     * O|X|O
     *
     * The correct move is to play on the top row.
     */
    @Test
    public void shouldPreventLosing() {
        // arrange
        model.play(0, 0); // X
        model.play(1, 0); // O
        model.play(1, 1); // X
        model.play(2, 0); // O
        model.play(2, 1); // X
        model.play(2, 2); // O
        model.play(0, 2); // X

        SmartMove move = new SmartMove(messageBox, model, 2);
        move.testMode = true;

        // act
        List<Location> locations = move.pickMoves(model);

        // assert
        Location[] actual = locations.toArray(new Location[locations.size()]);
        Location[] expected = new Location[] {
                new Location(0, 1)
        };
        assertArrayEquals(expected, actual);
    }

    /**
     * This test proves the CPU will play on a corner
     * when the user starts in the middle.
     */
    @Test
    public void shouldDefendCorner() {
        // arrange
        model.play(1, 1); // X

        SmartMove move = new SmartMove(messageBox, model, 2);
        move.testMode = true;

        // act
        List<Location> locations = move.pickMoves(model);

        // assert
        Location[] actual = locations.toArray(new Location[locations.size()]);
        Location[] expected = {
                new Location(0, 0),
                new Location(0, 2),
                new Location(2, 0),
                new Location(2, 2),
        };
        assertArrayEquals(expected, actual);
    }

    /**
     * X
     *  O
     *   X
     * ---
     * Expected:
     * X
     * OO
     *   X
     * ---
     * Actual:
     * X
     *  O
     * O X
     */
    @Test
    public void shouldDefendAgainstDoubleThreat() {
        // arrange
        model.play(0, 0); // X
        model.play(1, 1); // O
        model.play(2, 2); // X
        SmartMove move = new SmartMove(messageBox, model, 3);
        move.testMode = true;

        // act
        List<Location> locations = move.pickMoves(model);

        // assert
        Location[] actual = locations.toArray(new Location[locations.size()]);
        Location[] expected = {
                new Location(0, 1),
                new Location(1, 0),
                new Location(1, 2),
                new Location(2, 1),
        };
        assertArrayEquals(expected, actual);
    }
}

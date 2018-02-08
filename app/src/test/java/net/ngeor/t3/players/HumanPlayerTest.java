package net.ngeor.t3.players;

import android.content.Context;

import net.ngeor.t3.models.AILevel;
import net.ngeor.t3.models.GameModel;
import net.ngeor.t3.models.PlayerSymbol;
import net.ngeor.t3.settings.Settings;
import net.ngeor.t3.settings.serializable.AIPlayerDefinitionImpl;
import net.ngeor.t3.settings.serializable.HumanPlayerDefinitionImpl;
import net.ngeor.t3.settings.serializable.SettingsImpl;

import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.mock;

/**
 * Unit test for HumanPlayer.
 * Created by ngeor on 8/2/2018.
 */
public class HumanPlayerTest {

    private HumanPlayer player;
    private GameModel model;

    @Before
    public void before() {
        Context context = mock(Context.class);
        Settings settings = new SettingsImpl(3, 3,
                new HumanPlayerDefinitionImpl(PlayerSymbol.X),
                new AIPlayerDefinitionImpl(PlayerSymbol.O, AILevel.EASY));

        model = new GameModel(settings);
        player = new HumanPlayer(context, model, PlayerSymbol.X);
    }

    @Test
    public void getModel()
    {
        assertEquals(model, player.getModel());
    }

    @Test
    public void canIPlay_shouldBeFalse_whenGameIsNotStarted() {
        assertFalse(player.canIPlay());
    }

    @Test
    public void canIPlay_shouldBeTrue_whenGameIsStarted() {
        model.start();
        assertTrue(player.canIPlay());
    }
}

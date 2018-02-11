package net.ngeor.t3;

import android.content.Context;

import net.ngeor.t3.ai.MessageBox;
import net.ngeor.t3.models.AILevel;
import net.ngeor.t3.models.MutableGameModel;
import net.ngeor.t3.models.PlayerSymbol;
import net.ngeor.t3.players.AIPlayer;
import net.ngeor.t3.players.HumanPlayer;
import net.ngeor.t3.settings.AIPlayerDefinitionImpl;
import net.ngeor.t3.settings.HumanPlayerDefinitionImpl;
import net.ngeor.t3.settings.Settings;
import net.ngeor.t3.settings.SettingsImpl;

import org.junit.Test;
import org.mockito.Matchers;

import java.util.Arrays;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Unit tests for PlayerFactory.
 *
 * @author ngeor on 10/2/2018.
 */
public class PlayerFactoryTest {
    @Test
    public void createPlayers() {
        Context context = mock(Context.class);
        MutableGameModel model = mock(MutableGameModel.class);
        MessageBox messageBox = mock(MessageBox.class);
        CompositeTouchListener boardTouchListener = mock(CompositeTouchListener.class);
        PlayerFactory playerFactory = new PlayerFactory(context, model, messageBox, boardTouchListener);

        Settings settings = new SettingsImpl(3, 3, false, Arrays.asList(
                new HumanPlayerDefinitionImpl(PlayerSymbol.X),
                new AIPlayerDefinitionImpl(PlayerSymbol.O, AILevel.EASY)));
        when(model.getSettings()).thenReturn(settings);

        // act
        playerFactory.createPlayers();

        // assert
        verify(boardTouchListener).addListener(Matchers.any(HumanPlayer.class));
        verify(model, times(2)).addGameModelListener(Matchers.any(HumanPlayer.class));
        verify(model, times(2)).addGameModelListener(Matchers.any(AIPlayer.class));
    }

    @Test
    public void destroyPlayers() {
        Context context = mock(Context.class);
        MutableGameModel model = mock(MutableGameModel.class);
        MessageBox messageBox = mock(MessageBox.class);
        CompositeTouchListener boardTouchListener = mock(CompositeTouchListener.class);
        PlayerFactory playerFactory = new PlayerFactory(context, model, messageBox, boardTouchListener);

        Settings settings = new SettingsImpl(3, 3, false, Arrays.asList(
                new HumanPlayerDefinitionImpl(PlayerSymbol.X),
                new AIPlayerDefinitionImpl(PlayerSymbol.O, AILevel.EASY)));
        when(model.getSettings()).thenReturn(settings);
        playerFactory.createPlayers();

        // act
        playerFactory.destroyPlayers();

        // assert
        verify(boardTouchListener).removeListener(Matchers.any(HumanPlayer.class));
        verify(model, times(2)).removeGameModelListener(Matchers.any(HumanPlayer.class));
        verify(model, times(2)).removeGameModelListener(Matchers.any(AIPlayer.class));
    }
}

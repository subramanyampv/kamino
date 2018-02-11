package net.ngeor.t3.players;

import android.content.Context;
import android.os.Vibrator;
import android.view.MotionEvent;
import android.view.View;

import net.ngeor.t3.models.BoardModel;
import net.ngeor.t3.models.GameState;
import net.ngeor.t3.models.MutableGameModel;
import net.ngeor.t3.models.PlayerSymbol;
import net.ngeor.t3.settings.Settings;

import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Unit test for HumanPlayer.
 *
 * @author ngeor on 8/2/2018.
 */
public class HumanPlayerTest {

    private HumanPlayer player;
    private MutableGameModel model;
    private View view;
    private MotionEvent motionEvent;
    private Settings settings;

    @Before
    public void before() {
        // conditions are setup to allow for the player to play.
        Context context = mock(Context.class);
        when(context.getSystemService(Context.VIBRATOR_SERVICE)).thenReturn(mock(Vibrator.class));

        BoardModel boardModel = new BoardModel(3, 3);

        settings = mock(Settings.class);

        model = mock(MutableGameModel.class);
        when(model.getState()).thenReturn(GameState.WaitingPlayer);
        when(model.getTurn()).thenReturn(PlayerSymbol.X);
        when(model.getBoardModel()).thenReturn(boardModel);
        when(model.getSettings()).thenReturn(settings);

        player = new HumanPlayer(context, model, PlayerSymbol.X);

        view = mock(View.class);
        when(view.getWidth()).thenReturn(100);
        when(view.getHeight()).thenReturn(100);

        motionEvent = mock(MotionEvent.class);
        when(motionEvent.getAction()).thenReturn(MotionEvent.ACTION_UP);
        when(motionEvent.getX()).thenReturn(10.0f);
        when(motionEvent.getY()).thenReturn(10.0f);
    }

    @Test
    public void canIPlay_shouldBeFalse_whenGameIsNotStarted() {
        // arrange
        when(model.getState()).thenReturn(GameState.NotStarted);

        // act & assert
        assertFalse(player.canIPlay(model));
    }

    @Test
    public void canIPlay_shouldBeTrue_whenGameIsStarted() {
        // act & assert
        assertTrue(player.canIPlay(model));
    }

    @Test
    public void touch_doNothingOnDown() {
        // arrange
        when(motionEvent.getAction()).thenReturn(MotionEvent.ACTION_DOWN);

        // act & assert
        assertTrue(player.onTouch(view, motionEvent));
        verify(model, never()).play(anyInt(), anyInt());
    }

    @Test
    public void touch_cannotPlayWhenGameNotStarted() {
        // arrange
        when(model.getState()).thenReturn(GameState.NotStarted);

        // act & assert
        assertFalse(player.onTouch(view, motionEvent));
        verify(model, never()).play(anyInt(), anyInt());
    }

    @Test
    public void touch_cannotPlayWhenNotMyTurn() {
        // arrange
        when(model.getTurn()).thenReturn(PlayerSymbol.O);

        // act & assert
        assertFalse(player.onTouch(view, motionEvent));
        verify(model, never()).play(anyInt(), anyInt());
    }

    @Test
    public void touch_cannotPlayWhenTileTaken() {
        // arrange
        when(model.getBoardModel()).thenReturn(
                new BoardModel(3, 3).playAt(0, 0, PlayerSymbol.O));

        // act & assert
        assertTrue(player.onTouch(view, motionEvent));
        verify(model, never()).play(anyInt(), anyInt());
    }

    @Test
    public void touch_playOnUp() {
        // act & assert
        assertTrue(player.onTouch(view, motionEvent));
        verify(model).play(0, 0);
    }

    @Test
    public void stateChanged_whenICanPlay_invisibleModeOff() {
        player.stateChanged(model);
    }

    @Test
    public void stateChanged_whenICannotPlay_invisibleModeOff() {
        when(model.getState()).thenReturn(GameState.NotStarted);
        player.stateChanged(model);
    }

    @Test
    public void stateChanged_whenICanPlay_invisibleModeOn() {
        when(settings.isInvisibleMode()).thenReturn(true);
        player.stateChanged(model);
    }

    @Test
    public void stateChanged_whenICannotPlay_invisibleModeOn() {
        when(model.getState()).thenReturn(GameState.NotStarted);
        when(settings.isInvisibleMode()).thenReturn(true);
        player.stateChanged(model);
    }
}

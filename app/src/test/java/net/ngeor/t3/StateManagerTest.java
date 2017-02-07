package net.ngeor.t3;

import android.os.Bundle;
import net.ngeor.t3.models.AILevel;
import net.ngeor.t3.models.GameDto;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.*;

/**
 * Created by ngeor on 2/7/2017.
 */
public class StateManagerTest {
    private Bundle bundle;
    private StateManager stateManager;

    @Before
    public void before() {
        bundle = mock(Bundle.class);
        stateManager = new StateManager(bundle);
    }

    @Test
    public void getGameShouldGetSerializable() {
        // arrange
        GameDto result = mock(GameDto.class);
        when(bundle.getSerializable("game")).thenReturn(result);

        // act
        GameDto actual = stateManager.getGame();

        // assert
        assertEquals(result, actual);
    }

    @Test
    public void setGameShouldPutSerializable() {
        // arrange
        GameDto result = mock(GameDto.class);

        // act
        stateManager.setGame(result);

        // assert
        verify(bundle).putSerializable("game", result);
    }

    @Test
    public void getAILevelShouldGetEasyString() {
        // arrange
        when(bundle.getString("aiLevel")).thenReturn(AILevel.EASY.toString());

        // act
        AILevel actual = stateManager.getAILevel();

        // assert
        assertEquals(AILevel.EASY, actual);
    }

    @Test
    public void getAILevelShouldGetHardString() {
        // arrange
        when(bundle.getString("aiLevel")).thenReturn(AILevel.HARD.toString());

        // act
        AILevel actual = stateManager.getAILevel();

        // assert
        assertEquals(AILevel.HARD, actual);
    }

    @Test
    public void getAILevelShouldReturnEasyOnNullString() {
        // arrange
        when(bundle.getString("aiLevel")).thenReturn(null);

        // act
        AILevel actual = stateManager.getAILevel();

        // assert
        assertEquals(AILevel.EASY, actual);
    }

    @Test
    public void getAILevelShouldReturnEasyOnEmptyString() {
        // arrange
        when(bundle.getString("aiLevel")).thenReturn("");

        // act
        AILevel actual = stateManager.getAILevel();

        // assert
        assertEquals(AILevel.EASY, actual);
    }

    @Test
    public void getAILevelShouldReturnEasyOnInvalidString() {
        // arrange
        when(bundle.getString("aiLevel")).thenReturn("something strange");

        // act
        AILevel actual = stateManager.getAILevel();

        // assert
        assertEquals(AILevel.EASY, actual);
    }

    @Test
    public void setAILevelShouldPutString() {
        // act
        stateManager.setAILevel(AILevel.HARD);

        // assert
        verify(bundle).putString("aiLevel", AILevel.HARD.toString());
    }
}

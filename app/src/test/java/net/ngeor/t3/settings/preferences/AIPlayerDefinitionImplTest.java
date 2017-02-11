package net.ngeor.t3.settings.preferences;

import android.content.SharedPreferences;
import net.ngeor.t3.models.AILevel;
import net.ngeor.t3.models.Player;
import net.ngeor.t3.models.PlayerType;
import org.junit.Before;
import org.junit.Test;

import static junit.framework.Assert.assertEquals;
import static org.junit.Assert.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * Created by ngeor on 2/11/2017.
 */
public class AIPlayerDefinitionImplTest {
    private SharedPreferences sharedPreferences;
    private AIPlayerDefinitionImpl playerDefinition;

    @Before
    public void setUp() {
        sharedPreferences = mock(SharedPreferences.class);
        playerDefinition = new AIPlayerDefinitionImpl(sharedPreferences, 1, Player.O);
    }

    @Test
    public void getPlayer() {
        assertEquals(Player.O, playerDefinition.getPlayer());
    }

    @Test
    public void getPlayerType() {
        assertEquals(PlayerType.CPU, playerDefinition.getPlayerType());
    }

    @Test
    public void getAILevelShouldReturnEasyOnNullValue() {
        when(sharedPreferences.getString("pref_ai_level", "")).thenReturn(null);
        assertEquals(AILevel.EASY, playerDefinition.getAILevel());
    }

    @Test
    public void getAILevelShouldReturnEasyOnEmptyValue() {
        when(sharedPreferences.getString("pref_ai_level", "")).thenReturn("");
        assertEquals(AILevel.EASY, playerDefinition.getAILevel());
    }

    @Test
    public void getAILevelShouldReturnEasyOnInvalidValue() {
        when(sharedPreferences.getString("pref_ai_level", "")).thenReturn("invalid string");
        assertEquals(AILevel.EASY, playerDefinition.getAILevel());
    }

    @Test
    public void getAILevelShouldReturnHard() {
        when(sharedPreferences.getString("pref_ai_level", "")).thenReturn(AILevel.HARD.toString());
        assertEquals(AILevel.HARD, playerDefinition.getAILevel());
    }

}
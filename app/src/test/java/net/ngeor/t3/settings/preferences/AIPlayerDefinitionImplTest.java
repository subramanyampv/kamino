package net.ngeor.t3.settings.preferences;

import android.content.SharedPreferences;
import net.ngeor.t3.models.AILevel;
import net.ngeor.t3.models.PlayerSymbol;
import org.junit.Before;
import org.junit.Test;

import static junit.framework.Assert.assertEquals;
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
        playerDefinition = new AIPlayerDefinitionImpl(sharedPreferences, 1, PlayerSymbol.O);
    }

    @Test
    public void getPlayer() {
        assertEquals(PlayerSymbol.O, playerDefinition.getPlayerSymbol());
    }

    @Test
    public void getAILevel_ShouldReturnEasyOnNullValue() {
        when(sharedPreferences.getString("pref_ai_level", "")).thenReturn(null);
        assertEquals(AILevel.EASY, playerDefinition.getAILevel());
    }

    @Test
    public void getAILevel_ShouldReturnEasyOnEmptyValue() {
        when(sharedPreferences.getString("pref_ai_level", "")).thenReturn("");
        assertEquals(AILevel.EASY, playerDefinition.getAILevel());
    }

    @Test
    public void getAILevel_ShouldReturnEasyOnInvalidValue() {
        when(sharedPreferences.getString("pref_ai_level", "")).thenReturn("invalid string");
        assertEquals(AILevel.EASY, playerDefinition.getAILevel());
    }

    @Test
    public void getAILevel_ShouldReturnHard() {
        when(sharedPreferences.getString("pref_ai_level", "")).thenReturn(AILevel.HARD.toString());
        assertEquals(AILevel.HARD, playerDefinition.getAILevel());
    }

}
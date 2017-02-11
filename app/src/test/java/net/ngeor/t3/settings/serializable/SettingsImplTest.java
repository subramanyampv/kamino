package net.ngeor.t3.settings.serializable;

import net.ngeor.t3.models.AILevel;
import net.ngeor.t3.models.PlayerSymbol;
import net.ngeor.t3.settings.AIPlayerDefinition;
import net.ngeor.t3.settings.HumanPlayerDefinition;
import net.ngeor.t3.settings.PlayerDefinition;
import net.ngeor.t3.settings.Settings;
import org.junit.Test;

import java.util.Arrays;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * Created by ngeor on 2/11/2017.
 */
public class SettingsImplTest {
    @Test
    public void copyConstructor_shouldCopyRows() {
        Settings other = mock(Settings.class);
        when(other.getRows()).thenReturn(4);
        SettingsImpl settings = new SettingsImpl(other);
        assertEquals(4, settings.getRows());
    }

    @Test
    public void copyConstructor_shouldCopyCols() throws Exception {
        Settings other = mock(Settings.class);
        when(other.getCols()).thenReturn(5);
        SettingsImpl settings = new SettingsImpl(other);
        assertEquals(5, settings.getCols());
    }

    @Test
    public void copyConstructor_shouldCopyPlayerDefinitions() throws Exception {
        // arrange
        Settings other = mock(Settings.class);

        // arrange first player
        HumanPlayerDefinition otherFirst = mock(HumanPlayerDefinition.class);
        when(otherFirst.getPlayerSymbol()).thenReturn(PlayerSymbol.X);

        // arrange second player
        AIPlayerDefinition otherSecond = mock(AIPlayerDefinition.class);
        when(otherSecond.getPlayerSymbol()).thenReturn(PlayerSymbol.O);
        when(otherSecond.getAILevel()).thenReturn(AILevel.HARD);

        // arrange list
        when(other.getPlayerDefinitions()).thenReturn(Arrays.asList(otherFirst, otherSecond));
        SettingsImpl settings = new SettingsImpl(other);

        // act
        List<PlayerDefinition> playerDefinitions = settings.getPlayerDefinitions();

        // assert list
        assertNotNull(playerDefinitions);
        assertEquals(2, playerDefinitions.size());

        // assert first player
        HumanPlayerDefinition first = (HumanPlayerDefinition)playerDefinitions.get(0);
        assertNotNull(first);
        assertEquals(PlayerSymbol.X, first.getPlayerSymbol());

        // assert second player
        AIPlayerDefinition second = (AIPlayerDefinition)playerDefinitions.get(1);
        assertNotNull(second);
        assertEquals(PlayerSymbol.O, second.getPlayerSymbol());
        assertEquals(AILevel.HARD, second.getAILevel());
    }

    @Test
    public void argConstructor_shouldBeCorrect() {
        // arrange
        AIPlayerDefinition ai = new AIPlayerDefinitionImpl(PlayerSymbol.X, AILevel.MEDIUM);
        HumanPlayerDefinition human = new HumanPlayerDefinitionImpl(PlayerSymbol.O);

        // act
        SettingsImpl settings = new SettingsImpl(3, 4, ai, human);

        // assert
        assertEquals(3, settings.getRows());
        assertEquals(4, settings.getCols());
        assertEquals(Arrays.asList(ai, human), settings.getPlayerDefinitions());
    }
}
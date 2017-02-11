package net.ngeor.t3.models;

import net.ngeor.t3.settings.Settings;
import net.ngeor.t3.settings.serializable.AIPlayerDefinitionImpl;
import net.ngeor.t3.settings.serializable.HumanPlayerDefinitionImpl;
import net.ngeor.t3.settings.serializable.SettingsImpl;
import org.junit.Test;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.ObjectOutputStream;

/**
 * Created by ngeor on 2/11/2017.
 */
public class GameDtoTest {
    @Test
    public void shouldBeSerializable() throws IOException {
        Settings settings = new SettingsImpl(3, 3, new HumanPlayerDefinitionImpl(PlayerSymbol.X), new AIPlayerDefinitionImpl(PlayerSymbol.O, AILevel.MEDIUM));
        GameDto game = new GameDto(settings);
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        ObjectOutputStream objectOutputStream = new ObjectOutputStream(byteArrayOutputStream);
        objectOutputStream.writeObject(game);
    }
}

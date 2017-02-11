package net.ngeor.t3;

import android.os.Bundle;
import net.ngeor.t3.models.GameDto;

/**
 * Handles the state of the main activity during creation and saving.
 * Created by ngeor on 2/7/2017.
 */
public class StateManager {
    private final Bundle bundle;

    public StateManager(Bundle bundle) {
        this.bundle = bundle;
    }

    public GameDto getGame() {
        return (GameDto)bundle.getSerializable("game");
    }

    public void setGame(GameDto game) {
        bundle.putSerializable("game", game);
    }
}

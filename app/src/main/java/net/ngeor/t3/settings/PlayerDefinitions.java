package net.ngeor.t3.settings;

import android.support.annotation.NonNull;

import net.ngeor.t3.models.PlayerSymbol;

import java.io.Serializable;
import java.util.Objects;

/**
 * A collection of player definitions.
 *
 * @author ngeor on 11/2/2018.
 */
public class PlayerDefinitions implements Serializable {
    private final PlayerDefinition firstPlayerDefinition;
    private final PlayerDefinition secondPlayerDefinition;

    public PlayerDefinitions(PlayerDefinition firstPlayerDefinition, PlayerDefinition secondPlayerDefinition) {
        if (firstPlayerDefinition == null) {
            throw new IllegalArgumentException("firstPlayerDefinition");
        }

        if (secondPlayerDefinition == null) {
            throw new IllegalArgumentException("secondPlayerDefinition");
        }

        if (firstPlayerDefinition.equals(secondPlayerDefinition)) {
            throw new IllegalArgumentException("players cannot be equal");
        }

        if (Objects.equals(firstPlayerDefinition.getPlayerSymbol(), secondPlayerDefinition.getPlayerSymbol())) {
            throw new IllegalArgumentException("player symbols cannot be equal");
        }

        this.firstPlayerDefinition = firstPlayerDefinition;
        this.secondPlayerDefinition = secondPlayerDefinition;
    }

    public PlayerDefinition getFirstPlayerDefinition() {
        return firstPlayerDefinition;
    }

    public PlayerDefinition getSecondPlayerDefinition() {
        return secondPlayerDefinition;
    }

    @Override
    public boolean equals(Object o) {
        if (o instanceof PlayerDefinitions) {
            PlayerDefinitions that = (PlayerDefinitions) o;

            return firstPlayerDefinition.equals(that.firstPlayerDefinition)
                    && secondPlayerDefinition.equals(that.secondPlayerDefinition);
        }

        return false;
    }

    @Override
    public int hashCode() {
        int result = firstPlayerDefinition.hashCode();
        result = 31 * result + secondPlayerDefinition.hashCode();
        return result;
    }

    @NonNull
    public PlayerDefinition get(PlayerSymbol playerSymbol) {
        if (playerSymbol == null) {
            throw new IllegalArgumentException("playerSymbol");
        }

        return playerSymbol == firstPlayerDefinition.getPlayerSymbol() ? firstPlayerDefinition : secondPlayerDefinition;
    }
}

package net.ngeor.t3;

import net.ngeor.t3.models.GameModel;
import net.ngeor.t3.models.GameModelListener;
import net.ngeor.t3.models.MutableGameModel;
import net.ngeor.t3.models.PlayerSymbol;
import net.ngeor.t3.settings.HumanPlayerDefinition;
import net.ngeor.t3.settings.PlayerDefinition;

import java.util.List;

public class GameListener implements GameModelListener {
    private final MainActivityView view;

    public GameListener(MainActivityView view) {
        this.view = view;
    }

    @Override
    public void stateChanged(MutableGameModel model) {
        updateHeaderText(model);
        view.invalidateBoardView();
    }

    public void updateHeaderText(GameModel model) {
        int resourceId;

        switch (model.getState()) {
            case Draw:
                resourceId = R.string.state_game_over_draw;
                break;
            case Victory:
                if (isHumanTurn(model)) {
                    resourceId = R.string.state_game_over_human_wins;
                } else {
                    resourceId = R.string.state_game_over_cpu_wins;
                }

                break;
            case WaitingPlayer:
                resourceId = isHumanTurn(model) ? R.string.state_waiting_for_human : R.string.state_waiting_for_cpu;
                break;
            case NotStarted:
                resourceId = R.string.state_not_started;
                break;
            default:
                throw new IndexOutOfBoundsException();
        }

        view.setHeaderText(resourceId);
    }

    private boolean isHumanTurn(GameModel model) {
        PlayerSymbol turn = model.getTurn();
        List<PlayerDefinition> playerDefinitions = model.getSettings().getPlayerDefinitions();
        for (PlayerDefinition playerDefinition : playerDefinitions) {
            if (playerDefinition.getPlayerSymbol() == turn) {
                return playerDefinition instanceof HumanPlayerDefinition;
            }
        }

        throw new IllegalArgumentException("could not find player settings");
    }
}

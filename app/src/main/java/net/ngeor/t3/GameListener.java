package net.ngeor.t3;

import net.ngeor.t3.models.GameModel;
import net.ngeor.t3.models.GameModelListener;
import net.ngeor.t3.models.Player;
import net.ngeor.t3.models.PlayerType;
import net.ngeor.t3.settings.PlayerDefinition;
import net.ngeor.t3.settings.Settings;

public class GameListener implements GameModelListener {
    private final MainActivityView view;
    private final Settings settings;

    public GameListener(MainActivityView view, Settings settings) {
        this.view = view;
        this.settings = settings;
    }

    @Override
    public void stateChanged(GameModel model) {
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
        Player turn = model.getTurn();
        for (PlayerDefinition playerDefinition : settings.getPlayerDefinitions()) {
            if (playerDefinition.getPlayer() == turn) {
                return playerDefinition.getPlayerType() == PlayerType.HUMAN;
            }
        }

        throw new IllegalArgumentException("could not find player settings");
    }
}

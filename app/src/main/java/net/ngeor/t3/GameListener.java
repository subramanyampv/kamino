package net.ngeor.t3;

import net.ngeor.t3.models.GameModel;
import net.ngeor.t3.models.GameModelListener;
import net.ngeor.t3.models.Player;

public class GameListener implements GameModelListener {
    private final MainActivityView view;

    public GameListener(MainActivityView view) {
        this.view = view;
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
                Player winner = model.getTurn();
                if (model.isHuman(winner)) {
                    resourceId = R.string.state_game_over_human_wins;
                } else {
                    resourceId = R.string.state_game_over_cpu_wins;
                }

                break;
            case WaitingPlayer:
                resourceId = model.isHumanTurn() ? R.string.state_waiting_for_human : R.string.state_waiting_for_cpu;
                break;
            case NotStarted:
                resourceId = R.string.state_not_started;
                break;
            default:
                throw new IndexOutOfBoundsException();
        }

        view.setHeaderText(resourceId);
    }
}

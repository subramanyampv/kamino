package net.ngeor.t3.players;

import android.view.MotionEvent;
import android.view.View;
import net.ngeor.t3.models.GameModel;
import net.ngeor.t3.models.GameState;
import net.ngeor.t3.models.PlayerSymbol;
import net.ngeor.t3.models.TileState;

/**
 * Represents the human player.
 * Created by ngeor on 2/10/2017.
 */
public class HumanPlayer extends AbstractPlayer implements View.OnTouchListener {
    public HumanPlayer(GameModel model, PlayerSymbol turn) {
        super(model, turn);
    }

    @Override
    public boolean onTouch(View v, MotionEvent event) {
        final GameModel model = getModel();
        if (model.getState() != GameState.WaitingPlayer || !isMyTurn()) {
            return false;
        }

        if (event.getAction() == MotionEvent.ACTION_UP) {
            int col = (int) (model.getBoardModel().getCols() * event.getX() / v.getWidth());
            int row = (int) (model.getBoardModel().getRows() * event.getY() / v.getHeight());
            TileState tileState = model.getBoardModel().getTileState(row, col);
            if (tileState == TileState.EMPTY) {
                model.play(row, col);
            }
        }

        return true;
    }
}
